function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
const alertVariants = cva("relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground", {
  variants: {
    variant: {
      default: "bg-background text-foreground",
      destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});
const Alert = /*#__PURE__*/React.forwardRef(({
  className,
  variant,
  ...props
}, ref) => /*#__PURE__*/React.createElement("div", _extends({
  ref: ref,
  role: "alert",
  className: cn(alertVariants({
    variant
  }), className)
}, props)));
Alert.displayName = "Alert";
const AlertTitle = /*#__PURE__*/React.forwardRef(({
  className,
  ...props
}, ref) => /*#__PURE__*/React.createElement("h5", _extends({
  ref: ref,
  className: cn("mb-1 font-medium leading-none tracking-tight", className)
}, props)));
AlertTitle.displayName = "AlertTitle";
const AlertDescription = /*#__PURE__*/React.forwardRef(({
  className,
  ...props
}, ref) => /*#__PURE__*/React.createElement("div", _extends({
  ref: ref,
  className: cn("text-sm [&_p]:leading-relaxed", className)
}, props)));
AlertDescription.displayName = "AlertDescription";
export { Alert, AlertTitle, AlertDescription };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJSZWFjdCIsImN2YSIsImNuIiwiYWxlcnRWYXJpYW50cyIsInZhcmlhbnRzIiwidmFyaWFudCIsImRlZmF1bHQiLCJkZXN0cnVjdGl2ZSIsImRlZmF1bHRWYXJpYW50cyIsIkFsZXJ0IiwiZm9yd2FyZFJlZiIsImNsYXNzTmFtZSIsInByb3BzIiwicmVmIiwiY3JlYXRlRWxlbWVudCIsIl9leHRlbmRzIiwicm9sZSIsImRpc3BsYXlOYW1lIiwiQWxlcnRUaXRsZSIsIkFsZXJ0RGVzY3JpcHRpb24iXSwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy91aS9hbGVydC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCJcbmltcG9ydCB7IGN2YSwgdHlwZSBWYXJpYW50UHJvcHMgfSBmcm9tIFwiY2xhc3MtdmFyaWFuY2UtYXV0aG9yaXR5XCJcblxuaW1wb3J0IHsgY24gfSBmcm9tIFwiQC9saWIvdXRpbHNcIlxuXG5jb25zdCBhbGVydFZhcmlhbnRzID0gY3ZhKFxuICBcInJlbGF0aXZlIHctZnVsbCByb3VuZGVkLWxnIGJvcmRlciBwLTQgWyY+c3ZnfipdOnBsLTcgWyY+c3ZnK2Rpdl06dHJhbnNsYXRlLXktWy0zcHhdIFsmPnN2Z106YWJzb2x1dGUgWyY+c3ZnXTpsZWZ0LTQgWyY+c3ZnXTp0b3AtNCBbJj5zdmddOnRleHQtZm9yZWdyb3VuZFwiLFxuICB7XG4gICAgdmFyaWFudHM6IHtcbiAgICAgIHZhcmlhbnQ6IHtcbiAgICAgICAgZGVmYXVsdDogXCJiZy1iYWNrZ3JvdW5kIHRleHQtZm9yZWdyb3VuZFwiLFxuICAgICAgICBkZXN0cnVjdGl2ZTpcbiAgICAgICAgICBcImJvcmRlci1kZXN0cnVjdGl2ZS81MCB0ZXh0LWRlc3RydWN0aXZlIGRhcms6Ym9yZGVyLWRlc3RydWN0aXZlIFsmPnN2Z106dGV4dC1kZXN0cnVjdGl2ZVwiLFxuICAgICAgfSxcbiAgICB9LFxuICAgIGRlZmF1bHRWYXJpYW50czoge1xuICAgICAgdmFyaWFudDogXCJkZWZhdWx0XCIsXG4gICAgfSxcbiAgfVxuKVxuXG5jb25zdCBBbGVydCA9IFJlYWN0LmZvcndhcmRSZWY8XG4gIEhUTUxEaXZFbGVtZW50LFxuICBSZWFjdC5IVE1MQXR0cmlidXRlczxIVE1MRGl2RWxlbWVudD4gJiBWYXJpYW50UHJvcHM8dHlwZW9mIGFsZXJ0VmFyaWFudHM+XG4+KCh7IGNsYXNzTmFtZSwgdmFyaWFudCwgLi4ucHJvcHMgfSwgcmVmKSA9PiAoXG4gIDxkaXZcbiAgICByZWY9e3JlZn1cbiAgICByb2xlPVwiYWxlcnRcIlxuICAgIGNsYXNzTmFtZT17Y24oYWxlcnRWYXJpYW50cyh7IHZhcmlhbnQgfSksIGNsYXNzTmFtZSl9XG4gICAgey4uLnByb3BzfVxuICAvPlxuKSlcbkFsZXJ0LmRpc3BsYXlOYW1lID0gXCJBbGVydFwiXG5cbmNvbnN0IEFsZXJ0VGl0bGUgPSBSZWFjdC5mb3J3YXJkUmVmPFxuICBIVE1MUGFyYWdyYXBoRWxlbWVudCxcbiAgUmVhY3QuSFRNTEF0dHJpYnV0ZXM8SFRNTEhlYWRpbmdFbGVtZW50PlxuPigoeyBjbGFzc05hbWUsIC4uLnByb3BzIH0sIHJlZikgPT4gKFxuICA8aDVcbiAgICByZWY9e3JlZn1cbiAgICBjbGFzc05hbWU9e2NuKFwibWItMSBmb250LW1lZGl1bSBsZWFkaW5nLW5vbmUgdHJhY2tpbmctdGlnaHRcIiwgY2xhc3NOYW1lKX1cbiAgICB7Li4ucHJvcHN9XG4gIC8+XG4pKVxuQWxlcnRUaXRsZS5kaXNwbGF5TmFtZSA9IFwiQWxlcnRUaXRsZVwiXG5cbmNvbnN0IEFsZXJ0RGVzY3JpcHRpb24gPSBSZWFjdC5mb3J3YXJkUmVmPFxuICBIVE1MUGFyYWdyYXBoRWxlbWVudCxcbiAgUmVhY3QuSFRNTEF0dHJpYnV0ZXM8SFRNTFBhcmFncmFwaEVsZW1lbnQ+XG4+KCh7IGNsYXNzTmFtZSwgLi4ucHJvcHMgfSwgcmVmKSA9PiAoXG4gIDxkaXZcbiAgICByZWY9e3JlZn1cbiAgICBjbGFzc05hbWU9e2NuKFwidGV4dC1zbSBbJl9wXTpsZWFkaW5nLXJlbGF4ZWRcIiwgY2xhc3NOYW1lKX1cbiAgICB7Li4ucHJvcHN9XG4gIC8+XG4pKVxuQWxlcnREZXNjcmlwdGlvbi5kaXNwbGF5TmFtZSA9IFwiQWxlcnREZXNjcmlwdGlvblwiXG5cbmV4cG9ydCB7IEFsZXJ0LCBBbGVydFRpdGxlLCBBbGVydERlc2NyaXB0aW9uIH1cbiJdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sS0FBS0EsS0FBSyxNQUFNLE9BQU87QUFDOUIsU0FBU0MsR0FBRyxRQUEyQiwwQkFBMEI7QUFFakUsU0FBU0MsRUFBRSxRQUFRLGFBQWE7QUFFaEMsTUFBTUMsYUFBYSxHQUFHRixHQUFHLENBQ3ZCLDJKQUEySixFQUMzSjtFQUNFRyxRQUFRLEVBQUU7SUFDUkMsT0FBTyxFQUFFO01BQ1BDLE9BQU8sRUFBRSwrQkFBK0I7TUFDeENDLFdBQVcsRUFDVDtJQUNKO0VBQ0YsQ0FBQztFQUNEQyxlQUFlLEVBQUU7SUFDZkgsT0FBTyxFQUFFO0VBQ1g7QUFDRixDQUNGLENBQUM7QUFFRCxNQUFNSSxLQUFLLGdCQUFHVCxLQUFLLENBQUNVLFVBQVUsQ0FHNUIsQ0FBQztFQUFFQyxTQUFTO0VBQUVOLE9BQU87RUFBRSxHQUFHTztBQUFNLENBQUMsRUFBRUMsR0FBRyxrQkFDdENiLEtBQUEsQ0FBQWMsYUFBQSxRQUFBQyxRQUFBO0VBQ0VGLEdBQUcsRUFBRUEsR0FBSTtFQUNURyxJQUFJLEVBQUMsT0FBTztFQUNaTCxTQUFTLEVBQUVULEVBQUUsQ0FBQ0MsYUFBYSxDQUFDO0lBQUVFO0VBQVEsQ0FBQyxDQUFDLEVBQUVNLFNBQVM7QUFBRSxHQUNqREMsS0FBSyxDQUNWLENBQ0YsQ0FBQztBQUNGSCxLQUFLLENBQUNRLFdBQVcsR0FBRyxPQUFPO0FBRTNCLE1BQU1DLFVBQVUsZ0JBQUdsQixLQUFLLENBQUNVLFVBQVUsQ0FHakMsQ0FBQztFQUFFQyxTQUFTO0VBQUUsR0FBR0M7QUFBTSxDQUFDLEVBQUVDLEdBQUcsa0JBQzdCYixLQUFBLENBQUFjLGFBQUEsT0FBQUMsUUFBQTtFQUNFRixHQUFHLEVBQUVBLEdBQUk7RUFDVEYsU0FBUyxFQUFFVCxFQUFFLENBQUMsOENBQThDLEVBQUVTLFNBQVM7QUFBRSxHQUNyRUMsS0FBSyxDQUNWLENBQ0YsQ0FBQztBQUNGTSxVQUFVLENBQUNELFdBQVcsR0FBRyxZQUFZO0FBRXJDLE1BQU1FLGdCQUFnQixnQkFBR25CLEtBQUssQ0FBQ1UsVUFBVSxDQUd2QyxDQUFDO0VBQUVDLFNBQVM7RUFBRSxHQUFHQztBQUFNLENBQUMsRUFBRUMsR0FBRyxrQkFDN0JiLEtBQUEsQ0FBQWMsYUFBQSxRQUFBQyxRQUFBO0VBQ0VGLEdBQUcsRUFBRUEsR0FBSTtFQUNURixTQUFTLEVBQUVULEVBQUUsQ0FBQywrQkFBK0IsRUFBRVMsU0FBUztBQUFFLEdBQ3REQyxLQUFLLENBQ1YsQ0FDRixDQUFDO0FBQ0ZPLGdCQUFnQixDQUFDRixXQUFXLEdBQUcsa0JBQWtCO0FBRWpELFNBQVNSLEtBQUssRUFBRVMsVUFBVSxFQUFFQyxnQkFBZ0IiLCJpZ25vcmVMaXN0IjpbXX0=