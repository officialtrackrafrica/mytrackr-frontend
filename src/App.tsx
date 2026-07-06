// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
// import { LoginPage } from './pages/auth/LoginPage';
// import { SignUpPage } from './pages/auth/SignUpPage';
import './App.css';
import { SignUpForm } from './features/auth/components/SignUpForm';
import { LoginPage } from './features/auth/components/LoginPage';
import { VerifyOTPPage } from './features/auth/components/VerifyOtpPage';
import { LinkBankPage } from './features/auth/components/LinkBankPage';
import { HomePage } from './pages/Dashboard/Home/HomePage';
import { ProtectedRoute } from './features/auth/ProtectedRoutes';
import { TransactionsPage } from './pages/Dashboard/Transactions/Transactions';
import { ProfitAndLossPage } from './pages/Dashboard/Reports/ProfitAndLossPage';
import { CashflowPage } from './pages/Dashboard/Reports/CashflowPage';
import { BalanceSheetPage } from './pages/Dashboard/Reports/BalanceSheetPage';
import { AssetsLiabilitiesPage } from './pages/Dashboard/AssetsAndLiabilities/AssetsAndLiabilities';
import { TaxCalculatorPage } from './pages/Dashboard/Tax/Tax';
import { SettingsPage } from './pages/Dashboard/Settings/SettingsPage';
import { PaymentSuccessPage } from './pages/Dashboard/Settings/PaymentSuccessPage';
import { SupportPage } from './pages/Dashboard/Support/SupportPage';
import { SubscriptionPage } from './features/auth/components/SubscriptionPage';
import { ForgotPasswordPage } from './features/auth/components/ForgotPasswordPage';
import { ResetPasswordPage } from './features/auth/components/ResetPasswordPage';
import { PasswordSuccessPage } from './features/auth/components/PasswordSuccessPage';
import { EmailVerifiedPage } from './features/auth/components/EmailVerifiedPage';
import { AllSetupPage } from './features/auth/components/AllSetupPage';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/verify-email" element={<VerifyOTPPage />} />
        <Route path="/link-bank" element={<LinkBankPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<VerifyOTPPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/password-success" element={<PasswordSuccessPage />} />
        <Route path="/email-verified" element={<EmailVerifiedPage />} />
        <Route path="/all-setup" element={<AllSetupPage />} />
        <Route element={<SubscriptionPage />} path="/subscribe" />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <TransactionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/profit-and-loss"
          element={
            <ProtectedRoute>
              <ProfitAndLossPage />
            </ProtectedRoute>
          }
        />
        <Route path="/reports/cash-flow" element={<ProtectedRoute>
          <CashflowPage />
        </ProtectedRoute>} />
        <Route path="/reports/balance-sheet" element={<ProtectedRoute>
          <BalanceSheetPage />
        </ProtectedRoute>} />
        <Route path="/assets" element={<ProtectedRoute>
          <AssetsLiabilitiesPage />
        </ProtectedRoute>} />
        <Route path="/tax" element={<ProtectedRoute>
          <TaxCalculatorPage />
        </ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute>
          <SettingsPage />
        </ProtectedRoute>} />
        <Route path="/support" element={<ProtectedRoute>
          <SupportPage />
        </ProtectedRoute>} />
<Route path="/payment-success" element={<PaymentSuccessPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;