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

// Crop
import Fields from "./pages/crop/fields/Fields";

// Integration
import ErpFlow from "./pages/integration/ErpFlow";
import ValueChainReport from "./pages/integration/ValueChainReport";
import AddPayablesPage from "./pages/finance/payables/AddPayables";
import AddReceivablesPage from "./pages/finance/receivables/AddReceivables";
import AddPaymentPage from "./pages/finance/payments/AddPayment";
import AddCollectionPage from "./pages/finance/collections/AddCollection";

// Materials
import OrdersPage from "./pages/materials/orders/Orders";
import AgriInputsPage from "./pages/materials/agri-inputs/AgriInputs";
import InvoicesPage from "./pages/materials/invoices/Invoices";
import SuppliersPage from "./pages/materials/suppliers/Suppliers";
import AddOrdersPage from "./pages/materials/orders/AddOrders";
import SuppliesPage from "./pages/materials/supplies/Supplies";
import AddSuppliesPage from "./pages/materials/supplies/AddSupplies";
import AddInvoicesPage from "./pages/materials/invoices/AddInvoices";
import AddSupplierPage from "./pages/materials/suppliers/AddSupplier";
import CarePlansPage from "./pages/livestock/care-plans/CarePlans";
import AddCarePlansPage from "./pages/livestock/care-plans/AddCarePlans";
import ScheduleCarePlansPage from "./pages/livestock/care-plans/ScheduleCarePlan";
import AddScheduleCarePlansPage from "./pages/livestock/care-plans/AddScheduleCarePlans";
import HealthPage from "./pages/livestock/health/Health";
import VisitLogsPage from "./pages/livestock/VisitLogs";
import ReportPage from "./pages/livestock/report/Report";
import AddFieldsPage from "./pages/crop/fields/AddFields";
import FieldsDetailPage from "./pages/crop/fields/FieldsDetail";
import MapReviewPage from "./pages/crop/fields/MapReview";
import TreatmentAnimalPage from "./pages/treatment/animal/Animal";
import AddTreatmentAnimalPage from "./pages/treatment/animal/AddTreatmentAnimal";
import TreatmentPlantPage from "./pages/treatment/plant/Plant";
import AddTreatmentPlantPage from "./pages/treatment/plant/AddTreatmentPlant";
import ReportsPage from "./pages/crop/reports/Reports";
import TechnicalPlansPage from "./pages/crop/techinical-plans/TechnicalPlans";
import AddTechinicalPlansPage from "./pages/crop/techinical-plans/AddTechnicalPlans";
import CropPlantsPage from "./pages/crop/plants/Plants";
import AddPlantsPage from "./pages/crop/plants/AddPlants";
import PlantVarietyPage from "./pages/crop/plant-variety/PlantVariety";
import FarmingLogsPage from "./pages/crop/logs/FarmingLogs";

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
        <Route path="materials/supplies/add" element={<AddSuppliesPage />} />
        <Route path="materials/supplies" element={<SuppliesPage />} />
        <Route path="materials/orders" element={<OrdersPage />} />
        <Route path="materials/orders/add" element={<AddOrdersPage />} />
        <Route path="materials/agri-inputs" element={<AgriInputsPage />} />
        <Route path="materials/invoices" element={<InvoicesPage />} />
        <Route path="materials/invoices/add" element={<AddInvoicesPage />} />
        <Route path="materials/suppliers/add" element={<AddSupplierPage />} />
        <Route path="materials/suppliers" element={<SuppliersPage />} />

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
        <Route path="livestock/reports" element={<ReportPage />} />
        <Route path="livestock/visit-logs" element={<VisitLogsPage />} />
        <Route path="livestock/health" element={<HealthPage />} />
        <Route path="livestock/plans" element={<CarePlansPage />} />
        <Route path="livestock/plans/add" element={<AddCarePlansPage />} />
        <Route
          path="livestock/plans/schedule"
          element={<ScheduleCarePlansPage />}
        />
        <Route
          path="livestock/plans/schedule/add"
          element={<AddScheduleCarePlansPage />}
        />
        {/* Crop */}
        <Route path="crop/reports" element={<ReportsPage />} />
        <Route path="crop/fields" element={<Fields />} />
        <Route path="crop/fields/map" element={<MapReviewPage />} />
        <Route path="crop/fields/detail" element={<FieldsDetailPage />} />
        <Route path="crop/fields/add" element={<AddFieldsPage />} />
        <Route path="crop/logs" element={<FarmingLogsPage />} />
        <Route path="crop/plans" element={<TechnicalPlansPage />} />
        <Route path="crop/plans/add" element={<AddTechinicalPlansPage />} />
        <Route path="crop/plants" element={<CropPlantsPage />} />
        <Route path="crop/plants/add" element={<AddPlantsPage />} />
        <Route path="crop/plant-variety" element={<PlantVarietyPage />} />
        {/**Treatment */}
        <Route
          path="treatment/animals/add"
          element={<AddTreatmentAnimalPage />}
        />
        <Route path="treatment/animals" element={<TreatmentAnimalPage />} />
        <Route path="treatment/plants" element={<TreatmentPlantPage />} />
        <Route
          path="treatment/plants/add"
          element={<AddTreatmentPlantPage />}
        />
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
