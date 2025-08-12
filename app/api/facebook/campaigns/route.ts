import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

interface FacebookCampaign {
  id: string;
  name: string;
  status: string;
  objective: string;
  daily_budget?: string;
  lifetime_budget?: string;
  insights?: {
    data: Array<{
      spend: string;
      impressions: string;
      clicks: string;
      ctr: string;
      cpc: string;
      cpm: string;
      actions?: Array<{
        action_type: string;
        value: string;
      }>;
    }>;
  };
}

function getMockCampaigns() {
  return [
    {
      id: "1",
      name: "Personal Injury - California",
      status: "ACTIVE",
      objective: "LEAD_GENERATION",
      spend: 15234.50,
      impressions: 523456,
      clicks: 2341,
      conversions: 87,
      ctr: 0.45,
      cpc: 6.51,
      cpm: 29.11,
      cpl: 175.11,
    },
    {
      id: "2",
      name: "Estate Planning - Los Angeles",
      status: "ACTIVE",
      objective: "CONVERSIONS",
      spend: 8956.23,
      impressions: 341234,
      clicks: 1523,
      conversions: 45,
      ctr: 0.45,
      cpc: 5.88,
      cpm: 26.24,
      cpl: 199.03,
    },
  ];
}

export async function GET(request: Request) {
  const session = await getServerSession();
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get timeframe from query params
  const { searchParams } = new URL(request.url);
  const timeframe = searchParams.get('timeframe') || 'maximum';

  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
  
  if (!accessToken || accessToken.includes('your-facebook')) {
    console.log("Facebook API not configured, returning mock data");
    return NextResponse.json(getMockCampaigns());
  }

  try {
    console.log("Fetching Facebook campaigns...");
    
    // First, get the ad accounts
    const accountsUrl = `https://graph.facebook.com/v18.0/me/adaccounts?fields=id,name,account_status&access_token=${accessToken}`;
    const accountsResponse = await fetch(accountsUrl);
    
    if (!accountsResponse.ok) {
      const error = await accountsResponse.text();
      console.error("Failed to fetch ad accounts:", error);
      return NextResponse.json(getMockCampaigns());
    }
    
    const accountsData = await accountsResponse.json();
    console.log("Found ad accounts:", accountsData.data?.length || 0);
    
    if (!accountsData.data || accountsData.data.length === 0) {
      console.log("No ad accounts found");
      return NextResponse.json([]);
    }
    
    // Try to get campaigns from all ad accounts
    let allCampaigns: any[] = [];
    
    for (const account of accountsData.data) {
      console.log(`Checking account ${account.id} (${account.name}), status: ${account.account_status}`);
      
      try {
        // Use requested time range for insights
        const datePreset = timeframe === 'maximum' ? 'maximum' : timeframe;
        const campaignsUrl = `https://graph.facebook.com/v18.0/${account.id}/campaigns?fields=id,name,status,objective,daily_budget,lifetime_budget,created_time,updated_time,insights.date_preset(${datePreset}){spend,impressions,clicks,ctr,cpc,cpm,actions}&limit=100&access_token=${accessToken}`;
        
        const campaignsResponse = await fetch(campaignsUrl);
        
        if (!campaignsResponse.ok) {
          const error = await campaignsResponse.text();
          console.error(`Failed to fetch campaigns for ${account.id}:`, error);
          continue;
        }
        
        const campaignsData = await campaignsResponse.json();
        console.log(`Found ${campaignsData.data?.length || 0} campaigns in account ${account.id}`);
        
        if (campaignsData.data && campaignsData.data.length > 0) {
          allCampaigns = allCampaigns.concat(campaignsData.data);
        }
        
        // If no campaigns, try to get ad sets directly
        if (!campaignsData.data || campaignsData.data.length === 0) {
          console.log(`No campaigns found, trying ad sets for account ${account.id}`);
          
          const adsetsUrl = `https://graph.facebook.com/v18.0/${account.id}/adsets?fields=id,name,status,campaign{id,name,objective},insights.date_preset(${datePreset}){spend,impressions,clicks,ctr,cpc,cpm,actions}&limit=100&access_token=${accessToken}`;
          
          const adsetsResponse = await fetch(adsetsUrl);
          
          if (adsetsResponse.ok) {
            const adsetsData = await adsetsResponse.json();
            console.log(`Found ${adsetsData.data?.length || 0} ad sets in account ${account.id}`);
            
            // Group ad sets by campaign
            const campaignMap = new Map();
            
            for (const adset of (adsetsData.data || [])) {
              if (adset.campaign) {
                const campaignId = adset.campaign.id;
                if (!campaignMap.has(campaignId)) {
                  campaignMap.set(campaignId, {
                    id: campaignId,
                    name: adset.campaign.name || 'Unnamed Campaign',
                    status: adset.status,
                    objective: adset.campaign.objective || 'UNKNOWN',
                    insights: {
                      data: []
                    }
                  });
                }
                
                // Aggregate insights
                if (adset.insights?.data?.[0]) {
                  const campaign = campaignMap.get(campaignId);
                  const existingInsights = campaign.insights.data[0] || {
                    spend: "0",
                    impressions: "0",
                    clicks: "0",
                    ctr: "0",
                    cpc: "0",
                    cpm: "0",
                    actions: []
                  };
                  
                  const newInsights = adset.insights.data[0];
                  campaign.insights.data[0] = {
                    spend: String(parseFloat(existingInsights.spend) + parseFloat(newInsights.spend || "0")),
                    impressions: String(parseInt(existingInsights.impressions) + parseInt(newInsights.impressions || "0")),
                    clicks: String(parseInt(existingInsights.clicks) + parseInt(newInsights.clicks || "0")),
                    ctr: newInsights.ctr || existingInsights.ctr,
                    cpc: newInsights.cpc || existingInsights.cpc,
                    cpm: newInsights.cpm || existingInsights.cpm,
                    actions: [...(existingInsights.actions || []), ...(newInsights.actions || [])]
                  };
                }
              }
            }
            
            allCampaigns = allCampaigns.concat(Array.from(campaignMap.values()));
          }
        }
        
      } catch (accountError) {
        console.error(`Error processing account ${account.id}:`, accountError);
      }
    }
    
    console.log(`Total campaigns found across all accounts: ${allCampaigns.length}`);
    
    // Transform Facebook data to our format
    const campaigns = allCampaigns.map((campaign: FacebookCampaign) => {
      const insights = campaign.insights?.data?.[0];
      const conversions = insights?.actions?.find(
        (a) => a.action_type === 'lead' || 
               a.action_type === 'purchase' || 
               a.action_type === 'complete_registration' ||
               a.action_type === 'offsite_conversion.fb_pixel_lead'
      )?.value || "0";
      
      const spendAmount = parseFloat(insights?.spend || "0");
      const conversionCount = parseInt(conversions);
      const costPerLead = conversionCount > 0 ? spendAmount / conversionCount : 0;
      
      return {
        id: campaign.id,
        name: campaign.name || 'Unnamed Campaign',
        status: campaign.status || 'UNKNOWN',
        objective: campaign.objective || 'UNKNOWN',
        spend: spendAmount,
        impressions: parseInt(insights?.impressions || "0"),
        clicks: parseInt(insights?.clicks || "0"),
        conversions: conversionCount,
        ctr: parseFloat(insights?.ctr || "0"),
        cpc: parseFloat(insights?.cpc || "0"),
        cpm: parseFloat(insights?.cpm || "0"),
        cpl: costPerLead,
      };
    });
    
    // Sort by status alphabetically (A to Z)
    campaigns.sort((a, b) => a.status.localeCompare(b.status));
    
    console.log("Successfully processed", campaigns.length, "campaigns");
    
    // If still no campaigns, return mock data with a message
    if (campaigns.length === 0) {
      console.log("No campaigns with data found, returning sample data");
      return NextResponse.json([
        {
          id: "info",
          name: "No Active Campaigns Found",
          status: "INFO",
          objective: "Check your Facebook Ads Manager",
          spend: 0,
          impressions: 0,
          clicks: 0,
          conversions: 0,
          ctr: 0,
          cpc: 0,
          cpm: 0,
          cpl: 0,
        },
        ...getMockCampaigns()
      ]);
    }
    
    return NextResponse.json(campaigns);
    
  } catch (error) {
    console.error("Error fetching Facebook campaigns:", error);
    return NextResponse.json(getMockCampaigns());
  }
}