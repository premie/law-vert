'use client';

import { useEffect, useState, useRef } from 'react';

interface CampaignData {
  id: string;
  name: string;
  status: string;
  objective: string;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cpc: number;
  cpm: number;
  cpl: number;
}

interface ColumnConfig {
  key: keyof CampaignData | 'name';
  label: string;
  visible: boolean;
  width: number;
  minWidth?: number;
  format?: (value: any, row?: CampaignData) => string;
}

interface SavedView {
  id: string;
  name: string;
  createdAt: string;
  filters: {
    statusFilter: string;
    objectiveFilter: string;
    timeFrame: string;
    searchTerm: string;
  };
  columns: ColumnConfig[];
}

export default function DashboardPage() {
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<CampaignData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [objectiveFilter, setObjectiveFilter] = useState<string>('all');
  const [timeFrame, setTimeFrame] = useState<string>('maximum');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showColumnManager, setShowColumnManager] = useState(false);
  const [showViewManager, setShowViewManager] = useState(false);
  
  // Saved views
  const [savedViews, setSavedViews] = useState<SavedView[]>([]);
  const [currentViewId, setCurrentViewId] = useState<string | null>(null);
  const [newViewName, setNewViewName] = useState('');

  // Column configuration with minimum widths
  const [columns, setColumns] = useState<ColumnConfig[]>([
    { key: 'name', label: 'Campaign Name', visible: true, width: 250, minWidth: 150 },
    { key: 'status', label: 'Status', visible: true, width: 100, minWidth: 80 },
    { key: 'objective', label: 'Objective', visible: true, width: 150, minWidth: 100 },
    { key: 'spend', label: 'Spend', visible: true, width: 120, minWidth: 80 },
    { key: 'impressions', label: 'Impressions', visible: true, width: 130, minWidth: 90 },
    { key: 'clicks', label: 'Clicks', visible: true, width: 100, minWidth: 70 },
    { key: 'conversions', label: 'Leads', visible: true, width: 90, minWidth: 60 },
    { key: 'cpl', label: '$/Lead', visible: true, width: 100, minWidth: 70 },
    { key: 'ctr', label: 'CTR', visible: true, width: 80, minWidth: 60 },
    { key: 'cpc', label: 'CPC', visible: true, width: 90, minWidth: 60 },
    { key: 'cpm', label: 'CPM', visible: true, width: 90, minWidth: 60 },
  ]);

  // Resize state
  const [isResizing, setIsResizing] = useState(false);
  const [resizingColumn, setResizingColumn] = useState<number | null>(null);
  const resizeStartX = useRef<number>(0);
  const resizeStartWidth = useRef<number>(0);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCampaigns();
  }, [timeFrame]);

  useEffect(() => {
    applyFilters();
  }, [campaigns, statusFilter, objectiveFilter, searchTerm]);

  // Load saved views and last used view on mount
  useEffect(() => {
    const views = localStorage.getItem('savedViews');
    if (views) {
      try {
        const parsedViews = JSON.parse(views);
        setSavedViews(parsedViews);
      } catch (e) {
        console.error('Failed to load saved views');
      }
    }

    // Load last used view
    const lastViewId = localStorage.getItem('lastViewId');
    if (lastViewId) {
      const views = localStorage.getItem('savedViews');
      if (views) {
        const parsedViews = JSON.parse(views);
        const lastView = parsedViews.find((v: SavedView) => v.id === lastViewId);
        if (lastView) {
          loadView(lastView);
        }
      }
    } else {
      // Load default saved columns if no view is active
      const savedColumns = localStorage.getItem('campaignColumns');
      if (savedColumns) {
        try {
          const parsed = JSON.parse(savedColumns);
          const merged = columns.map(defaultCol => {
            const saved = parsed.find((c: ColumnConfig) => c.key === defaultCol.key);
            return saved ? { ...defaultCol, ...saved, minWidth: defaultCol.minWidth } : defaultCol;
          });
          setColumns(merged);
        } catch (e) {
          console.error('Failed to load saved columns');
        }
      }
    }
  }, []);

  // Save column settings
  const saveColumnSettings = (newColumns: ColumnConfig[]) => {
    setColumns(newColumns);
    localStorage.setItem('campaignColumns', JSON.stringify(newColumns));
    
    // Update current view if one is active
    if (currentViewId) {
      const updatedViews = savedViews.map(view => 
        view.id === currentViewId 
          ? { ...view, columns: newColumns }
          : view
      );
      setSavedViews(updatedViews);
      localStorage.setItem('savedViews', JSON.stringify(updatedViews));
    }
  };

  const saveView = () => {
    if (!newViewName.trim()) return;

    const newView: SavedView = {
      id: Date.now().toString(),
      name: newViewName,
      createdAt: new Date().toISOString(),
      filters: {
        statusFilter,
        objectiveFilter,
        timeFrame,
        searchTerm,
      },
      columns: [...columns],
    };

    const updatedViews = [...savedViews, newView];
    setSavedViews(updatedViews);
    localStorage.setItem('savedViews', JSON.stringify(updatedViews));
    setCurrentViewId(newView.id);
    localStorage.setItem('lastViewId', newView.id);
    setNewViewName('');
    setShowViewManager(false);
  };

  const loadView = (view: SavedView) => {
    setStatusFilter(view.filters.statusFilter);
    setObjectiveFilter(view.filters.objectiveFilter);
    setTimeFrame(view.filters.timeFrame);
    setSearchTerm(view.filters.searchTerm);
    setColumns(view.columns);
    setCurrentViewId(view.id);
    localStorage.setItem('lastViewId', view.id);
    setShowViewManager(false);
  };

  const deleteView = (viewId: string) => {
    const updatedViews = savedViews.filter(v => v.id !== viewId);
    setSavedViews(updatedViews);
    localStorage.setItem('savedViews', JSON.stringify(updatedViews));
    
    if (currentViewId === viewId) {
      setCurrentViewId(null);
      localStorage.removeItem('lastViewId');
    }
  };

  const updateCurrentView = () => {
    if (!currentViewId) return;

    const updatedViews = savedViews.map(view => 
      view.id === currentViewId 
        ? {
            ...view,
            filters: {
              statusFilter,
              objectiveFilter,
              timeFrame,
              searchTerm,
            },
            columns: [...columns],
          }
        : view
    );
    
    setSavedViews(updatedViews);
    localStorage.setItem('savedViews', JSON.stringify(updatedViews));
  };

  const fetchCampaigns = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/facebook/campaigns?timeframe=${timeFrame}`);
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to fetch campaigns: ${errorData}`);
      }
      const data = await response.json();
      setCampaigns(data);
      setFilteredCampaigns(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching campaigns:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...campaigns];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    if (objectiveFilter !== 'all') {
      filtered = filtered.filter(c => c.objective === objectiveFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCampaigns(filtered);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatPercent = (num: number) => {
    return `${num.toFixed(2)}%`;
  };

  // Column resize handlers
  const handleResizeStart = (e: React.MouseEvent, columnIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(true);
    setResizingColumn(columnIndex);
    resizeStartX.current = e.clientX;
    resizeStartWidth.current = columns[columnIndex].width;

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || resizingColumn === null) return;
      
      const diff = e.clientX - resizeStartX.current;
      const newWidth = resizeStartWidth.current + diff;
      const minWidth = columns[resizingColumn].minWidth || 50;
      
      const updatedColumns = [...columns];
      updatedColumns[resizingColumn] = {
        ...updatedColumns[resizingColumn],
        width: Math.max(minWidth, newWidth)
      };
      
      setColumns(updatedColumns);
    };

    const handleMouseUp = () => {
      if (isResizing) {
        setIsResizing(false);
        setResizingColumn(null);
        saveColumnSettings(columns);
        
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resizingColumn, columns]);

  const toggleColumnVisibility = (columnKey: string) => {
    const newColumns = columns.map(col => 
      col.key === columnKey ? { ...col, visible: !col.visible } : col
    );
    saveColumnSettings(newColumns);
  };

  const resetColumns = () => {
    const defaultColumns: ColumnConfig[] = [
      { key: 'name', label: 'Campaign Name', visible: true, width: 250, minWidth: 150 },
      { key: 'status', label: 'Status', visible: true, width: 100, minWidth: 80 },
      { key: 'objective', label: 'Objective', visible: true, width: 150, minWidth: 100 },
      { key: 'spend', label: 'Spend', visible: true, width: 120, minWidth: 80 },
      { key: 'impressions', label: 'Impressions', visible: true, width: 130, minWidth: 90 },
      { key: 'clicks', label: 'Clicks', visible: true, width: 100, minWidth: 70 },
      { key: 'conversions', label: 'Leads', visible: true, width: 90, minWidth: 60 },
      { key: 'cpl', label: '$/Lead', visible: true, width: 100, minWidth: 70 },
      { key: 'ctr', label: 'CTR', visible: true, width: 80, minWidth: 60 },
      { key: 'cpc', label: 'CPC', visible: true, width: 90, minWidth: 60 },
      { key: 'cpm', label: 'CPM', visible: true, width: 90, minWidth: 60 },
    ];
    saveColumnSettings(defaultColumns);
  };

  const getCellValue = (campaign: CampaignData, key: string) => {
    switch (key) {
      case 'name':
        return campaign.name;
      case 'status':
        return campaign.status;
      case 'objective':
        return campaign.objective;
      case 'spend':
        return formatCurrency(campaign.spend);
      case 'impressions':
        return formatNumber(campaign.impressions);
      case 'clicks':
        return formatNumber(campaign.clicks);
      case 'conversions':
        return formatNumber(campaign.conversions);
      case 'cpl':
        return campaign.conversions > 0 ? formatCurrency(campaign.cpl) : '-';
      case 'ctr':
        return formatPercent(campaign.ctr);
      case 'cpc':
        return formatCurrency(campaign.cpc);
      case 'cpm':
        return formatCurrency(campaign.cpm);
      default:
        return '';
    }
  };

  const uniqueStatuses = ['all', ...Array.from(new Set(campaigns.map(c => c.status)))];
  const uniqueObjectives = ['all', ...Array.from(new Set(campaigns.map(c => c.objective)))];
  const visibleColumns = columns.filter(col => col.visible);
  const currentView = savedViews.find(v => v.id === currentViewId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-800">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Facebook Campaigns</h1>
          <p className="mt-2 text-sm text-gray-700">
            Overview of all Facebook advertising campaigns
            {lastUpdated && (
              <span className="ml-2 text-gray-500">
                • Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            {currentView && (
              <span className="ml-2 text-blue-600">
                • View: {currentView.name}
              </span>
            )}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex gap-2">
          <button
            onClick={() => setShowViewManager(!showViewManager)}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            Views
          </button>
          <button
            onClick={() => setShowColumnManager(!showColumnManager)}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Columns
          </button>
          <button
            onClick={fetchCampaigns}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </div>

      {/* View Manager */}
      {showViewManager && (
        <div className="mt-4 bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Saved Views</h3>
          
          {/* Save New View */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newViewName}
              onChange={(e) => setNewViewName(e.target.value)}
              placeholder="Enter view name..."
              className="flex-1 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 text-gray-900 placeholder-gray-500 bg-white"
            />
            <button
              onClick={saveView}
              disabled={!newViewName.trim()}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              Save Current View
            </button>
            {currentViewId && (
              <button
                onClick={updateCurrentView}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Update View
              </button>
            )}
          </div>

          {/* List of Saved Views */}
          {savedViews.length > 0 ? (
            <div className="space-y-2">
              {savedViews.map(view => (
                <div
                  key={view.id}
                  className={`flex items-center justify-between p-2 rounded-md ${
                    currentViewId === view.id ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex-1">
                    <button
                      onClick={() => loadView(view)}
                      className="text-left w-full"
                    >
                      <p className="text-sm font-medium text-gray-900">{view.name}</p>
                      <p className="text-xs text-gray-500">
                        Created: {new Date(view.createdAt).toLocaleDateString()}
                      </p>
                    </button>
                  </div>
                  <button
                    onClick={() => deleteView(view.id)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No saved views yet. Configure your filters and columns, then save a view.</p>
          )}
        </div>
      )}

      {/* Column Manager */}
      {showColumnManager && (
        <div className="mt-4 bg-white shadow rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-gray-900">Manage Columns</h3>
            <button
              onClick={resetColumns}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Reset to Default
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {columns.map(col => (
              <label key={col.key} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={col.visible}
                  onChange={() => toggleColumnVisibility(col.key)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{col.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Filters Section */}
      <div className="mt-6 bg-white shadow rounded-lg p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Search Campaigns
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 text-gray-900 placeholder-gray-500 bg-white"
              placeholder="Search by name..."
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 text-gray-900 bg-white"
            >
              {uniqueStatuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Statuses' : status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="objective" className="block text-sm font-medium text-gray-700">
              Objective
            </label>
            <select
              id="objective"
              value={objectiveFilter}
              onChange={(e) => setObjectiveFilter(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 text-gray-900 bg-white"
            >
              {uniqueObjectives.map(objective => (
                <option key={objective} value={objective}>
                  {objective === 'all' ? 'All Objectives' : objective}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700">
              Time Frame
            </label>
            <select
              id="timeframe"
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 text-gray-900 bg-white"
            >
              <option value="maximum">All Time</option>
              <option value="last_30d">Last 30 Days</option>
              <option value="last_7d">Last 7 Days</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
            </select>
          </div>

          <div className="flex items-end">
            <div className="text-sm text-gray-500">
              Showing {filteredCampaigns.length} of {campaigns.length} campaigns
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Spend</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {formatCurrency(filteredCampaigns.reduce((sum, c) => sum + c.spend, 0))}
            </dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Impressions</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {formatNumber(filteredCampaigns.reduce((sum, c) => sum + c.impressions, 0))}
            </dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Clicks</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {formatNumber(filteredCampaigns.reduce((sum, c) => sum + c.clicks, 0))}
            </dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Leads</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {formatNumber(filteredCampaigns.reduce((sum, c) => sum + c.conversions, 0))}
            </dd>
          </div>
        </div>
      </div>

      {/* Campaign Table */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 sm:-mx-6 lg:-mx-8 overflow-x-auto">
          <div className="inline-block min-w-full py-2 align-middle px-4 sm:px-6 lg:px-8">
            <div 
              ref={tableRef}
              className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg"
              style={{ overflowX: 'auto' }}
            >
              <table className="min-w-full divide-y divide-gray-300 table-fixed">
                <thead className="bg-gray-50">
                  <tr>
                    {visibleColumns.map((col, index) => (
                      <th
                        key={col.key}
                        className="relative text-left text-sm font-semibold text-gray-900"
                        style={{ 
                          width: `${col.width}px`,
                          minWidth: `${col.minWidth || 50}px`
                        }}
                      >
                        <div className="px-3 py-3.5 pr-8">
                          {col.label}
                        </div>
                        <div
                          className="absolute top-0 right-0 w-4 h-full flex items-center justify-center cursor-col-resize select-none hover:bg-gray-200 group"
                          onMouseDown={(e) => handleResizeStart(e, index)}
                          style={{ 
                            cursor: 'col-resize',
                            userSelect: 'none'
                          }}
                        >
                          <div className="w-0.5 h-4/5 bg-gray-300 group-hover:bg-gray-400"></div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredCampaigns.length === 0 ? (
                    <tr>
                      <td colSpan={visibleColumns.length} className="px-3 py-4 text-sm text-gray-500 text-center">
                        No campaigns found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredCampaigns.map((campaign) => (
                      <tr key={campaign.id} className="hover:bg-gray-50">
                        {visibleColumns.map(col => (
                          <td 
                            key={col.key}
                            className="px-3 py-4 text-sm text-gray-500 truncate"
                            style={{ 
                              width: `${col.width}px`,
                              maxWidth: `${col.width}px`,
                              minWidth: `${col.minWidth || 50}px`
                            }}
                            title={getCellValue(campaign, col.key)}
                          >
                            {col.key === 'status' ? (
                              <span
                                className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                  campaign.status === 'ACTIVE'
                                    ? 'bg-green-100 text-green-800'
                                    : campaign.status === 'PAUSED'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {campaign.status}
                              </span>
                            ) : col.key === 'name' ? (
                              <span className="font-medium text-gray-900 block truncate">
                                {getCellValue(campaign, col.key)}
                              </span>
                            ) : col.key === 'cpl' ? (
                              <span className="font-semibold text-gray-900 block truncate">
                                {getCellValue(campaign, col.key)}
                              </span>
                            ) : (
                              <span className="block truncate">
                                {getCellValue(campaign, col.key)}
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}