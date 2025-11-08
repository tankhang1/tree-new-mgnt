import "./App.css";
import { Routes, Route } from "react-router";
import AuthPage from "./pages/auth";
import MainPage from "./pages/main";

// Finance
import Payables from "./pages/finance/payables/Payables";
import Receivables from "./pages/finance/receivables/Receivables";
import Payments from "./pages/finance/payments/Payments";
import Collections from "./pages/finance/collections/Collections";
import DebtsReport from "./pages/finance/debts-report/DebtsReport";

// Purchasing
import OrdersPurchase from "./pages/purchasing/Orders";
import AgriInputs from "./pages/purchasing/AgriInputs";
import InvoicesPurchase from "./pages/purchasing/Invoices";

// Sales
import OrdersSales from "./pages/sales/Orders";
import Tracking from "./pages/sales/Tracking";
import InvoicesSales from "./pages/sales/Invoices";

// Warehouse
import MaterialStock from "./pages/warehouse/MaterialStock";
import FinishedGoods from "./pages/warehouse/FinishedGoods";
import StockControl from "./pages/warehouse/StockControl";

// Production
import MasterPlan from "./pages/production/MasterPlan";
import FeedIntegration from "./pages/production/FeedIntegration";
import Mechanization from "./pages/production/Mechanization";

// Livestock
import Farms from "./pages/livestock/Farms";
import VisitLogs from "./pages/livestock/VisitLogs";
import CarePlans from "./pages/livestock/CarePlans";

// Crop
import Fields from "./pages/crop/Fields";
import FarmingLogs from "./pages/crop/FarmingLogs";
import TechnicalPlans from "./pages/crop/TechnicalPlans";

// Integration
import ErpFlow from "./pages/integration/ErpFlow";
import ValueChainReport from "./pages/integration/ValueChainReport";
import AddPayablesPage from "./pages/finance/payables/AddPayables";
import AddReceivablesPage from "./pages/finance/receivables/AddReceivables";
import AddPaymentPage from "./pages/finance/payments/AddPayment";
import AddCollectionPage from "./pages/finance/collections/AddCollection";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/main" element={<MainPage />}>
        {/* Finance */}
        <Route path="finance/payables/add" element={<AddPayablesPage />} />
        <Route path="finance/payables" element={<Payables />} />
        <Route
          path="finance/receivables/add"
          element={<AddReceivablesPage />}
        />
        <Route path="finance/receivables" element={<Receivables />} />
        <Route path="finance/payments/add" element={<AddPaymentPage />} />
        <Route path="finance/payments" element={<Payments />} />
        <Route path="finance/collections/add" element={<AddCollectionPage />} />
        <Route path="finance/collections" element={<Collections />} />
        <Route path="finance/debts-report" element={<DebtsReport />} />

        {/* Purchasing */}
        <Route path="purchasing/orders" element={<OrdersPurchase />} />
        <Route path="purchasing/agri-inputs" element={<AgriInputs />} />
        <Route path="purchasing/invoices" element={<InvoicesPurchase />} />

        {/* Sales */}
        <Route path="sales/orders" element={<OrdersSales />} />
        <Route path="sales/tracking" element={<Tracking />} />
        <Route path="sales/invoices" element={<InvoicesSales />} />

        {/* Warehouse */}
        <Route path="warehouse/material-stock" element={<MaterialStock />} />
        <Route path="warehouse/finished-goods" element={<FinishedGoods />} />
        <Route path="warehouse/stock-control" element={<StockControl />} />

        {/* Production */}
        <Route path="production/master-plan" element={<MasterPlan />} />
        <Route
          path="production/feed-integration"
          element={<FeedIntegration />}
        />
        <Route path="production/mechanization" element={<Mechanization />} />

        {/* Livestock */}
        <Route path="livestock/farms" element={<Farms />} />
        <Route path="livestock/visit-logs" element={<VisitLogs />} />
        <Route path="livestock/care-plans" element={<CarePlans />} />

        {/* Crop */}
        <Route path="crop/fields" element={<Fields />} />
        <Route path="crop/farming-logs" element={<FarmingLogs />} />
        <Route path="crop/technical-plans" element={<TechnicalPlans />} />

        {/* Integration */}
        <Route path="integration/erp-flow" element={<ErpFlow />} />
        <Route
          path="integration/value-chain-report"
          element={<ValueChainReport />}
        />

        {/* Default fallback */}
        <Route
          path="*"
          element={<div className="p-10 text-center">404 Not Found</div>}
        />
      </Route>
      <Route
        path="*"
        element={<div className="p-8 text-center">404 - Page Not Found</div>}
      />
    </Routes>
  );
}

export default App;
