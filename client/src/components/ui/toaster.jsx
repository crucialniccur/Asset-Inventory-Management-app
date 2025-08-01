function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import { useToast } from "../hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "../components/ui/toast";
import React from "react";

export function Toaster() {
  const {
    toasts
  } = useToast();
  return /*#__PURE__*/React.createElement(ToastProvider, null, toasts.map(function ({
    id,
    title,
    description,
    action,
    ...props
  }) {
    return /*#__PURE__*/React.createElement(Toast, _extends({
      key: id
    }, props), /*#__PURE__*/React.createElement("div", {
      className: "grid gap-1"
    }, title && /*#__PURE__*/React.createElement(ToastTitle, null, title), description && /*#__PURE__*/React.createElement(ToastDescription, null, description)), action, /*#__PURE__*/React.createElement(ToastClose, null));
  }), /*#__PURE__*/React.createElement(ToastViewport, null));
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJ1c2VUb2FzdCIsIlRvYXN0IiwiVG9hc3RDbG9zZSIsIlRvYXN0RGVzY3JpcHRpb24iLCJUb2FzdFByb3ZpZGVyIiwiVG9hc3RUaXRsZSIsIlRvYXN0Vmlld3BvcnQiLCJUb2FzdGVyIiwidG9hc3RzIiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50IiwibWFwIiwiaWQiLCJ0aXRsZSIsImRlc2NyaXB0aW9uIiwiYWN0aW9uIiwicHJvcHMiLCJfZXh0ZW5kcyIsImtleSIsImNsYXNzTmFtZSJdLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3VpL3RvYXN0ZXIudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVzZVRvYXN0IH0gZnJvbSBcIkAvaG9va3MvdXNlLXRvYXN0XCJcbmltcG9ydCB7XG4gIFRvYXN0LFxuICBUb2FzdENsb3NlLFxuICBUb2FzdERlc2NyaXB0aW9uLFxuICBUb2FzdFByb3ZpZGVyLFxuICBUb2FzdFRpdGxlLFxuICBUb2FzdFZpZXdwb3J0LFxufSBmcm9tIFwiQC9jb21wb25lbnRzL3VpL3RvYXN0XCJcblxuZXhwb3J0IGZ1bmN0aW9uIFRvYXN0ZXIoKSB7XG4gIGNvbnN0IHsgdG9hc3RzIH0gPSB1c2VUb2FzdCgpXG5cbiAgcmV0dXJuIChcbiAgICA8VG9hc3RQcm92aWRlcj5cbiAgICAgIHt0b2FzdHMubWFwKGZ1bmN0aW9uICh7IGlkLCB0aXRsZSwgZGVzY3JpcHRpb24sIGFjdGlvbiwgLi4ucHJvcHMgfSkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxUb2FzdCBrZXk9e2lkfSB7Li4ucHJvcHN9PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdhcC0xXCI+XG4gICAgICAgICAgICAgIHt0aXRsZSAmJiA8VG9hc3RUaXRsZT57dGl0bGV9PC9Ub2FzdFRpdGxlPn1cbiAgICAgICAgICAgICAge2Rlc2NyaXB0aW9uICYmIChcbiAgICAgICAgICAgICAgICA8VG9hc3REZXNjcmlwdGlvbj57ZGVzY3JpcHRpb259PC9Ub2FzdERlc2NyaXB0aW9uPlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICB7YWN0aW9ufVxuICAgICAgICAgICAgPFRvYXN0Q2xvc2UgLz5cbiAgICAgICAgICA8L1RvYXN0PlxuICAgICAgICApXG4gICAgICB9KX1cbiAgICAgIDxUb2FzdFZpZXdwb3J0IC8+XG4gICAgPC9Ub2FzdFByb3ZpZGVyPlxuICApXG59XG4iXSwibWFwcGluZ3MiOiI7QUFBQSxTQUFTQSxRQUFRLFFBQVEsbUJBQW1CO0FBQzVDLFNBQ0VDLEtBQUssRUFDTEMsVUFBVSxFQUNWQyxnQkFBZ0IsRUFDaEJDLGFBQWEsRUFDYkMsVUFBVSxFQUNWQyxhQUFhLFFBQ1IsdUJBQXVCO0FBRTlCLE9BQU8sU0FBU0MsT0FBT0EsQ0FBQSxFQUFHO0VBQ3hCLE1BQU07SUFBRUM7RUFBTyxDQUFDLEdBQUdSLFFBQVEsQ0FBQyxDQUFDO0VBRTdCLG9CQUNFUyxLQUFBLENBQUFDLGFBQUEsQ0FBQ04sYUFBYSxRQUNYSSxNQUFNLENBQUNHLEdBQUcsQ0FBQyxVQUFVO0lBQUVDLEVBQUU7SUFBRUMsS0FBSztJQUFFQyxXQUFXO0lBQUVDLE1BQU07SUFBRSxHQUFHQztFQUFNLENBQUMsRUFBRTtJQUNsRSxvQkFDRVAsS0FBQSxDQUFBQyxhQUFBLENBQUNULEtBQUssRUFBQWdCLFFBQUE7TUFBQ0MsR0FBRyxFQUFFTjtJQUFHLEdBQUtJLEtBQUssZ0JBQ3ZCUCxLQUFBLENBQUFDLGFBQUE7TUFBS1MsU0FBUyxFQUFDO0lBQVksR0FDeEJOLEtBQUssaUJBQUlKLEtBQUEsQ0FBQUMsYUFBQSxDQUFDTCxVQUFVLFFBQUVRLEtBQWtCLENBQUMsRUFDekNDLFdBQVcsaUJBQ1ZMLEtBQUEsQ0FBQUMsYUFBQSxDQUFDUCxnQkFBZ0IsUUFBRVcsV0FBOEIsQ0FFaEQsQ0FBQyxFQUNMQyxNQUFNLGVBQ1BOLEtBQUEsQ0FBQUMsYUFBQSxDQUFDUixVQUFVLE1BQUUsQ0FDUixDQUFDO0VBRVosQ0FBQyxDQUFDLGVBQ0ZPLEtBQUEsQ0FBQUMsYUFBQSxDQUFDSixhQUFhLE1BQUUsQ0FDSCxDQUFDO0FBRXBCIiwiaWdub3JlTGlzdCI6W119