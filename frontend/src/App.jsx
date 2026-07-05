import { DashboardProvider, useDashboard } from './context/DashboardContext.jsx';
import Topbar from './components/layout/Topbar.jsx';
import FilterBar from './components/filters/FilterBar.jsx';
import StatGrid from './components/stats/StatGrid.jsx';
import YearTrendChart from './components/charts/YearTrendChart.jsx';
import IntensityByRegionChart from './components/charts/IntensityByRegionChart.jsx';
import LikelihoodByCountryChart from './components/charts/LikelihoodByCountryChart.jsx';
import RelevanceBySectorChart from './components/charts/RelevanceBySectorChart.jsx';
import TopTopicsChart from './components/charts/TopTopicsChart.jsx';
import PestleDoughnutChart from './components/charts/PestleDoughnutChart.jsx';
import InsightsTable from './components/table/InsightsTable.jsx';

function Dashboard() {
  const { error, loading, insights } = useDashboard();

  if (error && insights.length === 0) {
    return (
      <div className="status-banner error">
        <p>Could not load data: {error}</p>
        <p>Make sure the API is running (npm run dev in /backend) and reload.</p>
      </div>
    );
  }

  return (
    <>
      <FilterBar />
      <StatGrid />
      {/* While refetching, hold the previous render at reduced opacity — no layout jump. */}
      <div className={`chart-grid${loading ? ' is-loading' : ''}`}>
        <YearTrendChart />
        <PestleDoughnutChart />
        <IntensityByRegionChart />
        <LikelihoodByCountryChart />
        <RelevanceBySectorChart />
        <TopTopicsChart />
      </div>
      <InsightsTable />
      <footer className="app-footer">
        Blackcoffer visualization assignment · data served from MongoDB via the Express API
      </footer>
    </>
  );
}

export default function App() {
  return (
    <DashboardProvider>
      <div className="app">
        <Topbar />
        <Dashboard />
      </div>
    </DashboardProvider>
  );
}
