function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "../../lib/utils";
import { buttonVariants } from "../components/ui/button";
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}) {
  return /*#__PURE__*/React.createElement(DayPicker, _extends({
    showOutsideDays: showOutsideDays,
    className: cn("p-3", className),
    classNames: {
      months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
      month: "space-y-4",
      caption: "flex justify-center pt-1 relative items-center",
      caption_label: "text-sm font-medium",
      nav: "space-x-1 flex items-center",
      nav_button: cn(buttonVariants({
        variant: "outline"
      }), "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"),
      nav_button_previous: "absolute left-1",
      nav_button_next: "absolute right-1",
      table: "w-full border-collapse space-y-1",
      head_row: "flex",
      head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
      row: "flex w-full mt-2",
      cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
      day: cn(buttonVariants({
        variant: "ghost"
      }), "h-9 w-9 p-0 font-normal aria-selected:opacity-100"),
      day_range_end: "day-range-end",
      day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
      day_today: "bg-accent text-accent-foreground",
      day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
      day_disabled: "text-muted-foreground opacity-50",
      day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
      day_hidden: "invisible",
      ...classNames
    },
    components: {
      IconLeft: ({
        ..._props
      }) => /*#__PURE__*/React.createElement(ChevronLeft, {
        className: "h-4 w-4"
      }),
      IconRight: ({
        ..._props
      }) => /*#__PURE__*/React.createElement(ChevronRight, {
        className: "h-4 w-4"
      })
    }
  }, props));
}
Calendar.displayName = "Calendar";
export { Calendar };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJSZWFjdCIsIkNoZXZyb25MZWZ0IiwiQ2hldnJvblJpZ2h0IiwiRGF5UGlja2VyIiwiY24iLCJidXR0b25WYXJpYW50cyIsIkNhbGVuZGFyIiwiY2xhc3NOYW1lIiwiY2xhc3NOYW1lcyIsInNob3dPdXRzaWRlRGF5cyIsInByb3BzIiwiY3JlYXRlRWxlbWVudCIsIl9leHRlbmRzIiwibW9udGhzIiwibW9udGgiLCJjYXB0aW9uIiwiY2FwdGlvbl9sYWJlbCIsIm5hdiIsIm5hdl9idXR0b24iLCJ2YXJpYW50IiwibmF2X2J1dHRvbl9wcmV2aW91cyIsIm5hdl9idXR0b25fbmV4dCIsInRhYmxlIiwiaGVhZF9yb3ciLCJoZWFkX2NlbGwiLCJyb3ciLCJjZWxsIiwiZGF5IiwiZGF5X3JhbmdlX2VuZCIsImRheV9zZWxlY3RlZCIsImRheV90b2RheSIsImRheV9vdXRzaWRlIiwiZGF5X2Rpc2FibGVkIiwiZGF5X3JhbmdlX21pZGRsZSIsImRheV9oaWRkZW4iLCJjb21wb25lbnRzIiwiSWNvbkxlZnQiLCJfcHJvcHMiLCJJY29uUmlnaHQiLCJkaXNwbGF5TmFtZSJdLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3VpL2NhbGVuZGFyLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IENoZXZyb25MZWZ0LCBDaGV2cm9uUmlnaHQgfSBmcm9tIFwibHVjaWRlLXJlYWN0XCI7XG5pbXBvcnQgeyBEYXlQaWNrZXIgfSBmcm9tIFwicmVhY3QtZGF5LXBpY2tlclwiO1xuXG5pbXBvcnQgeyBjbiB9IGZyb20gXCJAL2xpYi91dGlsc1wiO1xuaW1wb3J0IHsgYnV0dG9uVmFyaWFudHMgfSBmcm9tIFwiQC9jb21wb25lbnRzL3VpL2J1dHRvblwiO1xuXG5leHBvcnQgdHlwZSBDYWxlbmRhclByb3BzID0gUmVhY3QuQ29tcG9uZW50UHJvcHM8dHlwZW9mIERheVBpY2tlcj47XG5cbmZ1bmN0aW9uIENhbGVuZGFyKHtcbiAgY2xhc3NOYW1lLFxuICBjbGFzc05hbWVzLFxuICBzaG93T3V0c2lkZURheXMgPSB0cnVlLFxuICAuLi5wcm9wc1xufTogQ2FsZW5kYXJQcm9wcykge1xuICByZXR1cm4gKFxuICAgIDxEYXlQaWNrZXJcbiAgICAgIHNob3dPdXRzaWRlRGF5cz17c2hvd091dHNpZGVEYXlzfVxuICAgICAgY2xhc3NOYW1lPXtjbihcInAtM1wiLCBjbGFzc05hbWUpfVxuICAgICAgY2xhc3NOYW1lcz17e1xuICAgICAgICBtb250aHM6IFwiZmxleCBmbGV4LWNvbCBzbTpmbGV4LXJvdyBzcGFjZS15LTQgc206c3BhY2UteC00IHNtOnNwYWNlLXktMFwiLFxuICAgICAgICBtb250aDogXCJzcGFjZS15LTRcIixcbiAgICAgICAgY2FwdGlvbjogXCJmbGV4IGp1c3RpZnktY2VudGVyIHB0LTEgcmVsYXRpdmUgaXRlbXMtY2VudGVyXCIsXG4gICAgICAgIGNhcHRpb25fbGFiZWw6IFwidGV4dC1zbSBmb250LW1lZGl1bVwiLFxuICAgICAgICBuYXY6IFwic3BhY2UteC0xIGZsZXggaXRlbXMtY2VudGVyXCIsXG4gICAgICAgIG5hdl9idXR0b246IGNuKFxuICAgICAgICAgIGJ1dHRvblZhcmlhbnRzKHsgdmFyaWFudDogXCJvdXRsaW5lXCIgfSksXG4gICAgICAgICAgXCJoLTcgdy03IGJnLXRyYW5zcGFyZW50IHAtMCBvcGFjaXR5LTUwIGhvdmVyOm9wYWNpdHktMTAwXCJcbiAgICAgICAgKSxcbiAgICAgICAgbmF2X2J1dHRvbl9wcmV2aW91czogXCJhYnNvbHV0ZSBsZWZ0LTFcIixcbiAgICAgICAgbmF2X2J1dHRvbl9uZXh0OiBcImFic29sdXRlIHJpZ2h0LTFcIixcbiAgICAgICAgdGFibGU6IFwidy1mdWxsIGJvcmRlci1jb2xsYXBzZSBzcGFjZS15LTFcIixcbiAgICAgICAgaGVhZF9yb3c6IFwiZmxleFwiLFxuICAgICAgICBoZWFkX2NlbGw6XG4gICAgICAgICAgXCJ0ZXh0LW11dGVkLWZvcmVncm91bmQgcm91bmRlZC1tZCB3LTkgZm9udC1ub3JtYWwgdGV4dC1bMC44cmVtXVwiLFxuICAgICAgICByb3c6IFwiZmxleCB3LWZ1bGwgbXQtMlwiLFxuICAgICAgICBjZWxsOiBcImgtOSB3LTkgdGV4dC1jZW50ZXIgdGV4dC1zbSBwLTAgcmVsYXRpdmUgWyY6aGFzKFthcmlhLXNlbGVjdGVkXS5kYXktcmFuZ2UtZW5kKV06cm91bmRlZC1yLW1kIFsmOmhhcyhbYXJpYS1zZWxlY3RlZF0uZGF5LW91dHNpZGUpXTpiZy1hY2NlbnQvNTAgWyY6aGFzKFthcmlhLXNlbGVjdGVkXSldOmJnLWFjY2VudCBmaXJzdDpbJjpoYXMoW2FyaWEtc2VsZWN0ZWRdKV06cm91bmRlZC1sLW1kIGxhc3Q6WyY6aGFzKFthcmlhLXNlbGVjdGVkXSldOnJvdW5kZWQtci1tZCBmb2N1cy13aXRoaW46cmVsYXRpdmUgZm9jdXMtd2l0aGluOnotMjBcIixcbiAgICAgICAgZGF5OiBjbihcbiAgICAgICAgICBidXR0b25WYXJpYW50cyh7IHZhcmlhbnQ6IFwiZ2hvc3RcIiB9KSxcbiAgICAgICAgICBcImgtOSB3LTkgcC0wIGZvbnQtbm9ybWFsIGFyaWEtc2VsZWN0ZWQ6b3BhY2l0eS0xMDBcIlxuICAgICAgICApLFxuICAgICAgICBkYXlfcmFuZ2VfZW5kOiBcImRheS1yYW5nZS1lbmRcIixcbiAgICAgICAgZGF5X3NlbGVjdGVkOlxuICAgICAgICAgIFwiYmctcHJpbWFyeSB0ZXh0LXByaW1hcnktZm9yZWdyb3VuZCBob3ZlcjpiZy1wcmltYXJ5IGhvdmVyOnRleHQtcHJpbWFyeS1mb3JlZ3JvdW5kIGZvY3VzOmJnLXByaW1hcnkgZm9jdXM6dGV4dC1wcmltYXJ5LWZvcmVncm91bmRcIixcbiAgICAgICAgZGF5X3RvZGF5OiBcImJnLWFjY2VudCB0ZXh0LWFjY2VudC1mb3JlZ3JvdW5kXCIsXG4gICAgICAgIGRheV9vdXRzaWRlOlxuICAgICAgICAgIFwiZGF5LW91dHNpZGUgdGV4dC1tdXRlZC1mb3JlZ3JvdW5kIG9wYWNpdHktNTAgYXJpYS1zZWxlY3RlZDpiZy1hY2NlbnQvNTAgYXJpYS1zZWxlY3RlZDp0ZXh0LW11dGVkLWZvcmVncm91bmQgYXJpYS1zZWxlY3RlZDpvcGFjaXR5LTMwXCIsXG4gICAgICAgIGRheV9kaXNhYmxlZDogXCJ0ZXh0LW11dGVkLWZvcmVncm91bmQgb3BhY2l0eS01MFwiLFxuICAgICAgICBkYXlfcmFuZ2VfbWlkZGxlOlxuICAgICAgICAgIFwiYXJpYS1zZWxlY3RlZDpiZy1hY2NlbnQgYXJpYS1zZWxlY3RlZDp0ZXh0LWFjY2VudC1mb3JlZ3JvdW5kXCIsXG4gICAgICAgIGRheV9oaWRkZW46IFwiaW52aXNpYmxlXCIsXG4gICAgICAgIC4uLmNsYXNzTmFtZXMsXG4gICAgICB9fVxuICAgICAgY29tcG9uZW50cz17e1xuICAgICAgICBJY29uTGVmdDogKHsgLi4uX3Byb3BzIH0pID0+IDxDaGV2cm9uTGVmdCBjbGFzc05hbWU9XCJoLTQgdy00XCIgLz4sXG4gICAgICAgIEljb25SaWdodDogKHsgLi4uX3Byb3BzIH0pID0+IDxDaGV2cm9uUmlnaHQgY2xhc3NOYW1lPVwiaC00IHctNFwiIC8+LFxuICAgICAgfX1cbiAgICAgIHsuLi5wcm9wc31cbiAgICAvPlxuICApO1xufVxuQ2FsZW5kYXIuZGlzcGxheU5hbWUgPSBcIkNhbGVuZGFyXCI7XG5cbmV4cG9ydCB7IENhbGVuZGFyIH07XG4iXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEtBQUtBLEtBQUssTUFBTSxPQUFPO0FBQzlCLFNBQVNDLFdBQVcsRUFBRUMsWUFBWSxRQUFRLGNBQWM7QUFDeEQsU0FBU0MsU0FBUyxRQUFRLGtCQUFrQjtBQUU1QyxTQUFTQyxFQUFFLFFBQVEsYUFBYTtBQUNoQyxTQUFTQyxjQUFjLFFBQVEsd0JBQXdCO0FBSXZELFNBQVNDLFFBQVFBLENBQUM7RUFDaEJDLFNBQVM7RUFDVEMsVUFBVTtFQUNWQyxlQUFlLEdBQUcsSUFBSTtFQUN0QixHQUFHQztBQUNVLENBQUMsRUFBRTtFQUNoQixvQkFDRVYsS0FBQSxDQUFBVyxhQUFBLENBQUNSLFNBQVMsRUFBQVMsUUFBQTtJQUNSSCxlQUFlLEVBQUVBLGVBQWdCO0lBQ2pDRixTQUFTLEVBQUVILEVBQUUsQ0FBQyxLQUFLLEVBQUVHLFNBQVMsQ0FBRTtJQUNoQ0MsVUFBVSxFQUFFO01BQ1ZLLE1BQU0sRUFBRSwrREFBK0Q7TUFDdkVDLEtBQUssRUFBRSxXQUFXO01BQ2xCQyxPQUFPLEVBQUUsZ0RBQWdEO01BQ3pEQyxhQUFhLEVBQUUscUJBQXFCO01BQ3BDQyxHQUFHLEVBQUUsNkJBQTZCO01BQ2xDQyxVQUFVLEVBQUVkLEVBQUUsQ0FDWkMsY0FBYyxDQUFDO1FBQUVjLE9BQU8sRUFBRTtNQUFVLENBQUMsQ0FBQyxFQUN0Qyx5REFDRixDQUFDO01BQ0RDLG1CQUFtQixFQUFFLGlCQUFpQjtNQUN0Q0MsZUFBZSxFQUFFLGtCQUFrQjtNQUNuQ0MsS0FBSyxFQUFFLGtDQUFrQztNQUN6Q0MsUUFBUSxFQUFFLE1BQU07TUFDaEJDLFNBQVMsRUFDUCxnRUFBZ0U7TUFDbEVDLEdBQUcsRUFBRSxrQkFBa0I7TUFDdkJDLElBQUksRUFBRSxrVEFBa1Q7TUFDeFRDLEdBQUcsRUFBRXZCLEVBQUUsQ0FDTEMsY0FBYyxDQUFDO1FBQUVjLE9BQU8sRUFBRTtNQUFRLENBQUMsQ0FBQyxFQUNwQyxtREFDRixDQUFDO01BQ0RTLGFBQWEsRUFBRSxlQUFlO01BQzlCQyxZQUFZLEVBQ1Ysa0lBQWtJO01BQ3BJQyxTQUFTLEVBQUUsa0NBQWtDO01BQzdDQyxXQUFXLEVBQ1Qsc0lBQXNJO01BQ3hJQyxZQUFZLEVBQUUsa0NBQWtDO01BQ2hEQyxnQkFBZ0IsRUFDZCw4REFBOEQ7TUFDaEVDLFVBQVUsRUFBRSxXQUFXO01BQ3ZCLEdBQUcxQjtJQUNMLENBQUU7SUFDRjJCLFVBQVUsRUFBRTtNQUNWQyxRQUFRLEVBQUVBLENBQUM7UUFBRSxHQUFHQztNQUFPLENBQUMsa0JBQUtyQyxLQUFBLENBQUFXLGFBQUEsQ0FBQ1YsV0FBVztRQUFDTSxTQUFTLEVBQUM7TUFBUyxDQUFFLENBQUM7TUFDaEUrQixTQUFTLEVBQUVBLENBQUM7UUFBRSxHQUFHRDtNQUFPLENBQUMsa0JBQUtyQyxLQUFBLENBQUFXLGFBQUEsQ0FBQ1QsWUFBWTtRQUFDSyxTQUFTLEVBQUM7TUFBUyxDQUFFO0lBQ25FO0VBQUUsR0FDRUcsS0FBSyxDQUNWLENBQUM7QUFFTjtBQUNBSixRQUFRLENBQUNpQyxXQUFXLEdBQUcsVUFBVTtBQUVqQyxTQUFTakMsUUFBUSIsImlnbm9yZUxpc3QiOltdfQ==