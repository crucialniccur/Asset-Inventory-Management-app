function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
const badgeVariants = cva("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
  variants: {
    variant: {
      default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
      secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
      destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
      outline: "text-foreground"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});
function Badge({
  className,
  variant,
  ...props
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cn(badgeVariants({
      variant
    }), className)
  }, props));
}
export { Badge, badgeVariants };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJSZWFjdCIsImN2YSIsImNuIiwiYmFkZ2VWYXJpYW50cyIsInZhcmlhbnRzIiwidmFyaWFudCIsImRlZmF1bHQiLCJzZWNvbmRhcnkiLCJkZXN0cnVjdGl2ZSIsIm91dGxpbmUiLCJkZWZhdWx0VmFyaWFudHMiLCJCYWRnZSIsImNsYXNzTmFtZSIsInByb3BzIiwiY3JlYXRlRWxlbWVudCIsIl9leHRlbmRzIl0sInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvdWkvYmFkZ2UudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiXG5pbXBvcnQgeyBjdmEsIHR5cGUgVmFyaWFudFByb3BzIH0gZnJvbSBcImNsYXNzLXZhcmlhbmNlLWF1dGhvcml0eVwiXG5cbmltcG9ydCB7IGNuIH0gZnJvbSBcIkAvbGliL3V0aWxzXCJcblxuY29uc3QgYmFkZ2VWYXJpYW50cyA9IGN2YShcbiAgXCJpbmxpbmUtZmxleCBpdGVtcy1jZW50ZXIgcm91bmRlZC1mdWxsIGJvcmRlciBweC0yLjUgcHktMC41IHRleHQteHMgZm9udC1zZW1pYm9sZCB0cmFuc2l0aW9uLWNvbG9ycyBmb2N1czpvdXRsaW5lLW5vbmUgZm9jdXM6cmluZy0yIGZvY3VzOnJpbmctcmluZyBmb2N1czpyaW5nLW9mZnNldC0yXCIsXG4gIHtcbiAgICB2YXJpYW50czoge1xuICAgICAgdmFyaWFudDoge1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIFwiYm9yZGVyLXRyYW5zcGFyZW50IGJnLXByaW1hcnkgdGV4dC1wcmltYXJ5LWZvcmVncm91bmQgaG92ZXI6YmctcHJpbWFyeS84MFwiLFxuICAgICAgICBzZWNvbmRhcnk6XG4gICAgICAgICAgXCJib3JkZXItdHJhbnNwYXJlbnQgYmctc2Vjb25kYXJ5IHRleHQtc2Vjb25kYXJ5LWZvcmVncm91bmQgaG92ZXI6Ymctc2Vjb25kYXJ5LzgwXCIsXG4gICAgICAgIGRlc3RydWN0aXZlOlxuICAgICAgICAgIFwiYm9yZGVyLXRyYW5zcGFyZW50IGJnLWRlc3RydWN0aXZlIHRleHQtZGVzdHJ1Y3RpdmUtZm9yZWdyb3VuZCBob3ZlcjpiZy1kZXN0cnVjdGl2ZS84MFwiLFxuICAgICAgICBvdXRsaW5lOiBcInRleHQtZm9yZWdyb3VuZFwiLFxuICAgICAgfSxcbiAgICB9LFxuICAgIGRlZmF1bHRWYXJpYW50czoge1xuICAgICAgdmFyaWFudDogXCJkZWZhdWx0XCIsXG4gICAgfSxcbiAgfVxuKVxuXG5leHBvcnQgaW50ZXJmYWNlIEJhZGdlUHJvcHNcbiAgZXh0ZW5kcyBSZWFjdC5IVE1MQXR0cmlidXRlczxIVE1MRGl2RWxlbWVudD4sXG4gICAgVmFyaWFudFByb3BzPHR5cGVvZiBiYWRnZVZhcmlhbnRzPiB7fVxuXG5mdW5jdGlvbiBCYWRnZSh7IGNsYXNzTmFtZSwgdmFyaWFudCwgLi4ucHJvcHMgfTogQmFkZ2VQcm9wcykge1xuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPXtjbihiYWRnZVZhcmlhbnRzKHsgdmFyaWFudCB9KSwgY2xhc3NOYW1lKX0gey4uLnByb3BzfSAvPlxuICApXG59XG5cbmV4cG9ydCB7IEJhZGdlLCBiYWRnZVZhcmlhbnRzIH1cbiJdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sS0FBS0EsS0FBSyxNQUFNLE9BQU87QUFDOUIsU0FBU0MsR0FBRyxRQUEyQiwwQkFBMEI7QUFFakUsU0FBU0MsRUFBRSxRQUFRLGFBQWE7QUFFaEMsTUFBTUMsYUFBYSxHQUFHRixHQUFHLENBQ3ZCLHdLQUF3SyxFQUN4SztFQUNFRyxRQUFRLEVBQUU7SUFDUkMsT0FBTyxFQUFFO01BQ1BDLE9BQU8sRUFDTCwyRUFBMkU7TUFDN0VDLFNBQVMsRUFDUCxpRkFBaUY7TUFDbkZDLFdBQVcsRUFDVCx1RkFBdUY7TUFDekZDLE9BQU8sRUFBRTtJQUNYO0VBQ0YsQ0FBQztFQUNEQyxlQUFlLEVBQUU7SUFDZkwsT0FBTyxFQUFFO0VBQ1g7QUFDRixDQUNGLENBQUM7QUFNRCxTQUFTTSxLQUFLQSxDQUFDO0VBQUVDLFNBQVM7RUFBRVAsT0FBTztFQUFFLEdBQUdRO0FBQWtCLENBQUMsRUFBRTtFQUMzRCxvQkFDRWIsS0FBQSxDQUFBYyxhQUFBLFFBQUFDLFFBQUE7SUFBS0gsU0FBUyxFQUFFVixFQUFFLENBQUNDLGFBQWEsQ0FBQztNQUFFRTtJQUFRLENBQUMsQ0FBQyxFQUFFTyxTQUFTO0VBQUUsR0FBS0MsS0FBSyxDQUFHLENBQUM7QUFFNUU7QUFFQSxTQUFTRixLQUFLLEVBQUVSLGFBQWEiLCJpZ25vcmVMaXN0IjpbXX0=