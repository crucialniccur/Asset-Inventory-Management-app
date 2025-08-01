function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from "react";
import { cn } from "../../lib/utils";
const Input = /*#__PURE__*/React.forwardRef(({
  className,
  type,
  ...props
}, ref) => {
  return /*#__PURE__*/React.createElement("input", _extends({
    type: type,
    className: cn("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
    ref: ref
  }, props));
});
Input.displayName = "Input";
export { Input };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJSZWFjdCIsImNuIiwiSW5wdXQiLCJmb3J3YXJkUmVmIiwiY2xhc3NOYW1lIiwidHlwZSIsInByb3BzIiwicmVmIiwiY3JlYXRlRWxlbWVudCIsIl9leHRlbmRzIiwiZGlzcGxheU5hbWUiXSwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy91aS9pbnB1dC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCJcblxuaW1wb3J0IHsgY24gfSBmcm9tIFwiQC9saWIvdXRpbHNcIlxuXG5jb25zdCBJbnB1dCA9IFJlYWN0LmZvcndhcmRSZWY8SFRNTElucHV0RWxlbWVudCwgUmVhY3QuQ29tcG9uZW50UHJvcHM8XCJpbnB1dFwiPj4oXG4gICh7IGNsYXNzTmFtZSwgdHlwZSwgLi4ucHJvcHMgfSwgcmVmKSA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxpbnB1dFxuICAgICAgICB0eXBlPXt0eXBlfVxuICAgICAgICBjbGFzc05hbWU9e2NuKFxuICAgICAgICAgIFwiZmxleCBoLTEwIHctZnVsbCByb3VuZGVkLW1kIGJvcmRlciBib3JkZXItaW5wdXQgYmctYmFja2dyb3VuZCBweC0zIHB5LTIgdGV4dC1iYXNlIHJpbmctb2Zmc2V0LWJhY2tncm91bmQgZmlsZTpib3JkZXItMCBmaWxlOmJnLXRyYW5zcGFyZW50IGZpbGU6dGV4dC1zbSBmaWxlOmZvbnQtbWVkaXVtIGZpbGU6dGV4dC1mb3JlZ3JvdW5kIHBsYWNlaG9sZGVyOnRleHQtbXV0ZWQtZm9yZWdyb3VuZCBmb2N1cy12aXNpYmxlOm91dGxpbmUtbm9uZSBmb2N1cy12aXNpYmxlOnJpbmctMiBmb2N1cy12aXNpYmxlOnJpbmctcmluZyBmb2N1cy12aXNpYmxlOnJpbmctb2Zmc2V0LTIgZGlzYWJsZWQ6Y3Vyc29yLW5vdC1hbGxvd2VkIGRpc2FibGVkOm9wYWNpdHktNTAgbWQ6dGV4dC1zbVwiLFxuICAgICAgICAgIGNsYXNzTmFtZVxuICAgICAgICApfVxuICAgICAgICByZWY9e3JlZn1cbiAgICAgICAgey4uLnByb3BzfVxuICAgICAgLz5cbiAgICApXG4gIH1cbilcbklucHV0LmRpc3BsYXlOYW1lID0gXCJJbnB1dFwiXG5cbmV4cG9ydCB7IElucHV0IH1cbiJdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sS0FBS0EsS0FBSyxNQUFNLE9BQU87QUFFOUIsU0FBU0MsRUFBRSxRQUFRLGFBQWE7QUFFaEMsTUFBTUMsS0FBSyxnQkFBR0YsS0FBSyxDQUFDRyxVQUFVLENBQzVCLENBQUM7RUFBRUMsU0FBUztFQUFFQyxJQUFJO0VBQUUsR0FBR0M7QUFBTSxDQUFDLEVBQUVDLEdBQUcsS0FBSztFQUN0QyxvQkFDRVAsS0FBQSxDQUFBUSxhQUFBLFVBQUFDLFFBQUE7SUFDRUosSUFBSSxFQUFFQSxJQUFLO0lBQ1hELFNBQVMsRUFBRUgsRUFBRSxDQUNYLGdZQUFnWSxFQUNoWUcsU0FDRixDQUFFO0lBQ0ZHLEdBQUcsRUFBRUE7RUFBSSxHQUNMRCxLQUFLLENBQ1YsQ0FBQztBQUVOLENBQ0YsQ0FBQztBQUNESixLQUFLLENBQUNRLFdBQVcsR0FBRyxPQUFPO0FBRTNCLFNBQVNSLEtBQUsiLCJpZ25vcmVMaXN0IjpbXX0=