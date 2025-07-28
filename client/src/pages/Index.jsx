import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Login from '@/components/Login';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import AssetList from '@/components/AssetList';
import RequestsTable from '@/components/RequestsTable';
import RoleSwitcher from '@/components/RoleSwitcher';
import AddAssetForm from '@/components/AddAssetForm';
import Settings from '@/components/Settings';
import AssetDetail from '@/components/AssetDetail';
import UserManagement from '@/components/UserManagement';
import RequestForm from '@/components/RequestForm';
import AssetAllocation from '@/components/AssetAllocation';
const AppContent = () => {
  const {
    user,
    isLoading
  } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedAssetId, setSelectedAssetId] = useState(null);
  if (isLoading) {
    return /*#__PURE__*/React.createElement("div", {
      className: "min-h-screen flex items-center justify-center bg-background"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-center"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"
    }), /*#__PURE__*/React.createElement("p", {
      className: "text-muted-foreground"
    }, "Loading...")));
  }
  if (!user) {
    return /*#__PURE__*/React.createElement(Login, null);
  }
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return /*#__PURE__*/React.createElement(Dashboard, {
          onNavigateToTab: setActiveTab
        });
      case 'assets':
        return selectedAssetId ? /*#__PURE__*/React.createElement(AssetDetail, {
          assetId: selectedAssetId,
          onClose: () => setSelectedAssetId(null)
        }) : /*#__PURE__*/React.createElement("div", {
          className: "p-6"
        }, /*#__PURE__*/React.createElement(AssetList, {
          onNavigateToAddAsset: () => setActiveTab('add-asset')
        }));
      case 'requests':
        return user?.role === 'Employee' ? /*#__PURE__*/React.createElement(RequestForm, {
          onSubmit: () => setActiveTab('dashboard')
        }) : /*#__PURE__*/React.createElement("div", {
          className: "p-6"
        }, /*#__PURE__*/React.createElement("div", {
          className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
        }, /*#__PURE__*/React.createElement("h1", {
          className: "text-3xl font-bold"
        }, "Requests"), /*#__PURE__*/React.createElement(RoleSwitcher, null)), /*#__PURE__*/React.createElement(RequestsTable, null));
      case 'allocations':
        return /*#__PURE__*/React.createElement(AssetAllocation, null);
      case 'users':
        return /*#__PURE__*/React.createElement(UserManagement, null);
      case 'add-asset':
        return /*#__PURE__*/React.createElement("div", {
          className: "p-6"
        }, /*#__PURE__*/React.createElement("div", {
          className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
        }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
          className: "text-3xl font-bold mb-2"
        }, "Add Asset"), /*#__PURE__*/React.createElement("p", {
          className: "text-muted-foreground"
        }, "Add new asset with details and documentation")), /*#__PURE__*/React.createElement(RoleSwitcher, null)), /*#__PURE__*/React.createElement(AddAssetForm, null));
      case 'settings':
        return /*#__PURE__*/React.createElement("div", {
          className: "p-6"
        }, /*#__PURE__*/React.createElement("div", {
          className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
        }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
          className: "text-3xl font-bold mb-2"
        }, "Settings"), /*#__PURE__*/React.createElement("p", {
          className: "text-muted-foreground"
        }, "Manage your account and system preferences")), /*#__PURE__*/React.createElement(RoleSwitcher, null)), /*#__PURE__*/React.createElement(Settings, null));
      default:
        return /*#__PURE__*/React.createElement(Dashboard, null);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "flex h-screen bg-background"
  }, /*#__PURE__*/React.createElement(Sidebar, {
    activeTab: activeTab,
    setActiveTab: setActiveTab
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-auto"
  }, /*#__PURE__*/React.createElement("header", {
    className: "sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-sm text-muted-foreground"
  }, "Asset Management System"), /*#__PURE__*/React.createElement(RoleSwitcher, null))), renderContent()));
};
const Index = () => {
  return /*#__PURE__*/React.createElement(AuthProvider, null, /*#__PURE__*/React.createElement(AppContent, null));
};
export default Index;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJSZWFjdCIsInVzZVN0YXRlIiwiQXV0aFByb3ZpZGVyIiwidXNlQXV0aCIsIkxvZ2luIiwiU2lkZWJhciIsIkRhc2hib2FyZCIsIkFzc2V0TGlzdCIsIlJlcXVlc3RzVGFibGUiLCJSb2xlU3dpdGNoZXIiLCJBZGRBc3NldEZvcm0iLCJTZXR0aW5ncyIsIkFzc2V0RGV0YWlsIiwiVXNlck1hbmFnZW1lbnQiLCJSZXF1ZXN0Rm9ybSIsIkFzc2V0QWxsb2NhdGlvbiIsIkFwcENvbnRlbnQiLCJ1c2VyIiwiaXNMb2FkaW5nIiwiYWN0aXZlVGFiIiwic2V0QWN0aXZlVGFiIiwic2VsZWN0ZWRBc3NldElkIiwic2V0U2VsZWN0ZWRBc3NldElkIiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTmFtZSIsInJlbmRlckNvbnRlbnQiLCJvbk5hdmlnYXRlVG9UYWIiLCJhc3NldElkIiwib25DbG9zZSIsIm9uTmF2aWdhdGVUb0FkZEFzc2V0Iiwicm9sZSIsIm9uU3VibWl0IiwiSW5kZXgiXSwic291cmNlcyI6WyIuLi8uLi9zcmMvcGFnZXMvSW5kZXgudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEF1dGhQcm92aWRlciwgdXNlQXV0aCB9IGZyb20gJ0AvY29udGV4dHMvQXV0aENvbnRleHQnO1xuaW1wb3J0IExvZ2luIGZyb20gJ0AvY29tcG9uZW50cy9Mb2dpbic7XG5pbXBvcnQgU2lkZWJhciBmcm9tICdAL2NvbXBvbmVudHMvU2lkZWJhcic7XG5pbXBvcnQgRGFzaGJvYXJkIGZyb20gJ0AvY29tcG9uZW50cy9EYXNoYm9hcmQnO1xuaW1wb3J0IEFzc2V0TGlzdCBmcm9tICdAL2NvbXBvbmVudHMvQXNzZXRMaXN0JztcbmltcG9ydCBSZXF1ZXN0c1RhYmxlIGZyb20gJ0AvY29tcG9uZW50cy9SZXF1ZXN0c1RhYmxlJztcbmltcG9ydCBSb2xlU3dpdGNoZXIgZnJvbSAnQC9jb21wb25lbnRzL1JvbGVTd2l0Y2hlcic7XG5pbXBvcnQgQWRkQXNzZXRGb3JtIGZyb20gJ0AvY29tcG9uZW50cy9BZGRBc3NldEZvcm0nO1xuaW1wb3J0IFNldHRpbmdzIGZyb20gJ0AvY29tcG9uZW50cy9TZXR0aW5ncyc7XG5pbXBvcnQgQXNzZXREZXRhaWwgZnJvbSAnQC9jb21wb25lbnRzL0Fzc2V0RGV0YWlsJztcbmltcG9ydCBVc2VyTWFuYWdlbWVudCBmcm9tICdAL2NvbXBvbmVudHMvVXNlck1hbmFnZW1lbnQnO1xuaW1wb3J0IFJlcXVlc3RGb3JtIGZyb20gJ0AvY29tcG9uZW50cy9SZXF1ZXN0Rm9ybSc7XG5pbXBvcnQgQXNzZXRBbGxvY2F0aW9uIGZyb20gJ0AvY29tcG9uZW50cy9Bc3NldEFsbG9jYXRpb24nO1xuXG5jb25zdCBBcHBDb250ZW50OiBSZWFjdC5GQyA9ICgpID0+IHtcbiAgY29uc3QgeyB1c2VyLCBpc0xvYWRpbmcgfSA9IHVzZUF1dGgoKTtcbiAgY29uc3QgW2FjdGl2ZVRhYiwgc2V0QWN0aXZlVGFiXSA9IHVzZVN0YXRlKCdkYXNoYm9hcmQnKTtcbiAgY29uc3QgW3NlbGVjdGVkQXNzZXRJZCwgc2V0U2VsZWN0ZWRBc3NldElkXSA9IHVzZVN0YXRlPG51bWJlciB8IG51bGw+KG51bGwpO1xuXG4gIGlmIChpc0xvYWRpbmcpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtaW4taC1zY3JlZW4gZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgYmctYmFja2dyb3VuZFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LTggaC04IGJvcmRlci00IGJvcmRlci1wcmltYXJ5IGJvcmRlci10LXRyYW5zcGFyZW50IHJvdW5kZWQtZnVsbCBhbmltYXRlLXNwaW4gbXgtYXV0byBtYi00XCI+PC9kaXY+XG4gICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1tdXRlZC1mb3JlZ3JvdW5kXCI+TG9hZGluZy4uLjwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgaWYgKCF1c2VyKSB7XG4gICAgcmV0dXJuIDxMb2dpbiAvPjtcbiAgfVxuXG4gIGNvbnN0IHJlbmRlckNvbnRlbnQgPSAoKSA9PiB7XG4gICAgc3dpdGNoIChhY3RpdmVUYWIpIHtcbiAgICAgIGNhc2UgJ2Rhc2hib2FyZCc6XG4gICAgICAgIHJldHVybiA8RGFzaGJvYXJkIG9uTmF2aWdhdGVUb1RhYj17c2V0QWN0aXZlVGFifSAvPjtcbiAgICAgIGNhc2UgJ2Fzc2V0cyc6XG4gICAgICAgIHJldHVybiBzZWxlY3RlZEFzc2V0SWQgPyAoXG4gICAgICAgICAgPEFzc2V0RGV0YWlsIFxuICAgICAgICAgICAgYXNzZXRJZD17c2VsZWN0ZWRBc3NldElkfSBcbiAgICAgICAgICAgIG9uQ2xvc2U9eygpID0+IHNldFNlbGVjdGVkQXNzZXRJZChudWxsKX0gXG4gICAgICAgICAgLz5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInAtNlwiPlxuICAgICAgICAgICAgPEFzc2V0TGlzdCBvbk5hdmlnYXRlVG9BZGRBc3NldD17KCkgPT4gc2V0QWN0aXZlVGFiKCdhZGQtYXNzZXQnKX0gLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICAgIGNhc2UgJ3JlcXVlc3RzJzpcbiAgICAgICAgcmV0dXJuIHVzZXI/LnJvbGUgPT09ICdFbXBsb3llZScgPyAoXG4gICAgICAgICAgPFJlcXVlc3RGb3JtIG9uU3VibWl0PXsoKSA9PiBzZXRBY3RpdmVUYWIoJ2Rhc2hib2FyZCcpfSAvPlxuICAgICAgICApIDogKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicC02XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2wgc206ZmxleC1yb3cgc206aXRlbXMtY2VudGVyIHNtOmp1c3RpZnktYmV0d2VlbiBnYXAtNCBtYi02XCI+XG4gICAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJ0ZXh0LTN4bCBmb250LWJvbGRcIj5SZXF1ZXN0czwvaDE+XG4gICAgICAgICAgICAgIDxSb2xlU3dpdGNoZXIgLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPFJlcXVlc3RzVGFibGUgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICAgIGNhc2UgJ2FsbG9jYXRpb25zJzpcbiAgICAgICAgcmV0dXJuIDxBc3NldEFsbG9jYXRpb24gLz47XG4gICAgICBjYXNlICd1c2Vycyc6XG4gICAgICAgIHJldHVybiA8VXNlck1hbmFnZW1lbnQgLz47XG4gICAgICBjYXNlICdhZGQtYXNzZXQnOlxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicC02XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2wgc206ZmxleC1yb3cgc206aXRlbXMtY2VudGVyIHNtOmp1c3RpZnktYmV0d2VlbiBnYXAtNCBtYi02XCI+XG4gICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGgxIGNsYXNzTmFtZT1cInRleHQtM3hsIGZvbnQtYm9sZCBtYi0yXCI+QWRkIEFzc2V0PC9oMT5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LW11dGVkLWZvcmVncm91bmRcIj5BZGQgbmV3IGFzc2V0IHdpdGggZGV0YWlscyBhbmQgZG9jdW1lbnRhdGlvbjwvcD5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxSb2xlU3dpdGNoZXIgLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPEFkZEFzc2V0Rm9ybSAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgICAgY2FzZSAnc2V0dGluZ3MnOlxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicC02XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2wgc206ZmxleC1yb3cgc206aXRlbXMtY2VudGVyIHNtOmp1c3RpZnktYmV0d2VlbiBnYXAtNCBtYi02XCI+XG4gICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGgxIGNsYXNzTmFtZT1cInRleHQtM3hsIGZvbnQtYm9sZCBtYi0yXCI+U2V0dGluZ3M8L2gxPlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtbXV0ZWQtZm9yZWdyb3VuZFwiPk1hbmFnZSB5b3VyIGFjY291bnQgYW5kIHN5c3RlbSBwcmVmZXJlbmNlczwvcD5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxSb2xlU3dpdGNoZXIgLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPFNldHRpbmdzIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gPERhc2hib2FyZCAvPjtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaC1zY3JlZW4gYmctYmFja2dyb3VuZFwiPlxuICAgICAgPFNpZGViYXIgYWN0aXZlVGFiPXthY3RpdmVUYWJ9IHNldEFjdGl2ZVRhYj17c2V0QWN0aXZlVGFifSAvPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4LTEgb3ZlcmZsb3ctYXV0b1wiPlxuICAgICAgICA8aGVhZGVyIGNsYXNzTmFtZT1cInN0aWNreSB0b3AtMCB6LTEwIGJnLWJhY2tncm91bmQvOTUgYmFja2Ryb3AtYmx1ciBzdXBwb3J0cy1bYmFja2Ryb3AtZmlsdGVyXTpiZy1iYWNrZ3JvdW5kLzYwIGJvcmRlci1iXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gcC00XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gdGV4dC1tdXRlZC1mb3JlZ3JvdW5kXCI+XG4gICAgICAgICAgICAgIEFzc2V0IE1hbmFnZW1lbnQgU3lzdGVtXG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxSb2xlU3dpdGNoZXIgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9oZWFkZXI+XG4gICAgICAgIHtyZW5kZXJDb250ZW50KCl9XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbmNvbnN0IEluZGV4OiBSZWFjdC5GQyA9ICgpID0+IHtcbiAgcmV0dXJuIChcbiAgICA8QXV0aFByb3ZpZGVyPlxuICAgICAgPEFwcENvbnRlbnQgLz5cbiAgICA8L0F1dGhQcm92aWRlcj5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEluZGV4O1xuIl0sIm1hcHBpbmdzIjoiQUFBQSxPQUFPQSxLQUFLLElBQUlDLFFBQVEsUUFBUSxPQUFPO0FBQ3ZDLFNBQVNDLFlBQVksRUFBRUMsT0FBTyxRQUFRLHdCQUF3QjtBQUM5RCxPQUFPQyxLQUFLLE1BQU0sb0JBQW9CO0FBQ3RDLE9BQU9DLE9BQU8sTUFBTSxzQkFBc0I7QUFDMUMsT0FBT0MsU0FBUyxNQUFNLHdCQUF3QjtBQUM5QyxPQUFPQyxTQUFTLE1BQU0sd0JBQXdCO0FBQzlDLE9BQU9DLGFBQWEsTUFBTSw0QkFBNEI7QUFDdEQsT0FBT0MsWUFBWSxNQUFNLDJCQUEyQjtBQUNwRCxPQUFPQyxZQUFZLE1BQU0sMkJBQTJCO0FBQ3BELE9BQU9DLFFBQVEsTUFBTSx1QkFBdUI7QUFDNUMsT0FBT0MsV0FBVyxNQUFNLDBCQUEwQjtBQUNsRCxPQUFPQyxjQUFjLE1BQU0sNkJBQTZCO0FBQ3hELE9BQU9DLFdBQVcsTUFBTSwwQkFBMEI7QUFDbEQsT0FBT0MsZUFBZSxNQUFNLDhCQUE4QjtBQUUxRCxNQUFNQyxVQUFvQixHQUFHQSxDQUFBLEtBQU07RUFDakMsTUFBTTtJQUFFQyxJQUFJO0lBQUVDO0VBQVUsQ0FBQyxHQUFH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QUNOVCxLQUFBLENBQUF1QixhQUFBLENBQUNiLFlBQVksTUFBRSxDQUNaLENBQUM7TUFFVixLQUFLLFVBQVU7UUFDYixvQkFDRVYsS0FBQSxDQUFBdUIsYUFBQTtVQUFLQyxTQUFTLEVBQUM7UUFBSyxnQkFDbEJ4QixLQUFBLENBQUF1QixhQUFBO1VBQUtDLFNBQVMsRUFBQztRQUF5RSxnQkFDdEZ4QixLQUFBLENBQUF1QixhQUFBLDJCQUNFdkIsS0FBQSxDQUFBdUIsYUFBQTtVQUFJQyxTQUFTLEVBQUM7UUFBeUIsR0FBQyxVQUFZLENBQUMsZUFDckR4QixLQUFBLENBQUF1QixhQUFBO1VBQUdDLFNBQVMsRUFBQztRQUF1QixHQUFDLDRDQUE2QyxDQUMvRSxDQUFDLGVBQ054QixLQUFBLENBQUF1QixhQUFBLENBQUNkLFlBQVksTUFBRSxDQUNaLENBQUMsZUFDTlQsS0FBQSxDQUFBdUIsYUFBQSxDQUFDWixRQUFRLE1BQUUsQ0FDUixDQUFDO01BRVY7UUFDRSxvQkFBT1gsS0FBQSxDQUFBdUIsYUFBQSxDQUFDakIsU0FBUyxNQUFFLENBQUM7SUFDeEI7RUFDRixDQUFDO0VBRUQsb0JBQ0VOLEtBQUEsQ0FBQXVCLGFBQUE7SUFBS0MsU0FBUyxFQUFDO0VBQTZCLGdCQUMxQ3hCLEtBQUEsQ0FBQXVCLGFBQUEsQ0FBQ2xCLE9BQU87SUFBQ2MsU0FBUyxFQUFFQSxTQUFVO0lBQUNDLFlBQVksRUFBRUE7RUFBYSxDQUFFLENBQUMsZUFDN0RwQixLQUFBLENBQUF1QixhQUFBO0lBQUtDLFNBQVMsRUFBQztFQUFzQixnQkFDbkN4QixLQUFBLENBQUF1QixhQUFBO0lBQVFDLFNBQVMsRUFBQztFQUF1RyxnQkFDdkh4QixLQUFBLENBQUF1QixhQUFBO0lBQUtDLFNBQVMsRUFBQztFQUF1QyxnQkFDcER4QixLQUFBLENBQUF1QixhQUFBO0lBQUtDLFNBQVMsRUFBQztFQUErQixHQUFDLHlCQUUxQyxDQUFDLGVBQ054QixLQUFBLENBQUF1QixhQUFBLENBQUNkLFlBQVksTUFBRSxDQUNaLENBQ0MsQ0FBQyxFQUNSZ0IsYUFBYSxDQUFDLENBQ1osQ0FDRixDQUFDO0FBRVYsQ0FBQztBQUVELE1BQU1PLEtBQWUsR0FBR0EsQ0FBQSxLQUFNO0VBQzVCLG9CQUNFaEMsS0FBQSxDQUFBdUIsYUFBQSxDQUFDckIsWUFBWSxxQkFDWEYsS0FBQSxDQUFBdUIsYUFBQSxDQUFDUCxVQUFVLE1BQUUsQ0FDRCxDQUFDO0FBRW5CLENBQUM7QUFFRCxlQUFlZ0IsS0FBSyIsImlnbm9yZUxpc3QiOltdfQ==