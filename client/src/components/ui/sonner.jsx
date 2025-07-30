function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";
import React from "react";

const Toaster = ({
  ...props
}) => {
  const {
    theme = "system"
  } = useTheme();
  return /*#__PURE__*/React.createElement(Sonner, _extends({
    theme: theme,
    className: "toaster group",
    toastOptions: {
      classNames: {
        toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
        description: "group-[.toast]:text-muted-foreground",
        actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
        cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
      }
    }
  }, props));
};
export { Toaster, toast };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJ1c2VUaGVtZSIsIlRvYXN0ZXIiLCJTb25uZXIiLCJ0b2FzdCIsInByb3BzIiwidGhlbWUiLCJSZWFjdCIsImNyZWF0ZUVsZW1lbnQiLCJfZXh0ZW5kcyIsImNsYXNzTmFtZSIsInRvYXN0T3B0aW9ucyIsImNsYXNzTmFtZXMiLCJkZXNjcmlwdGlvbiIsImFjdGlvbkJ1dHRvbiIsImNhbmNlbEJ1dHRvbiJdLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3VpL3Nvbm5lci50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlVGhlbWUgfSBmcm9tIFwibmV4dC10aGVtZXNcIlxuaW1wb3J0IHsgVG9hc3RlciBhcyBTb25uZXIsIHRvYXN0IH0gZnJvbSBcInNvbm5lclwiXG5cbnR5cGUgVG9hc3RlclByb3BzID0gUmVhY3QuQ29tcG9uZW50UHJvcHM8dHlwZW9mIFNvbm5lcj5cblxuY29uc3QgVG9hc3RlciA9ICh7IC4uLnByb3BzIH06IFRvYXN0ZXJQcm9wcykgPT4ge1xuICBjb25zdCB7IHRoZW1lID0gXCJzeXN0ZW1cIiB9ID0gdXNlVGhlbWUoKVxuXG4gIHJldHVybiAoXG4gICAgPFNvbm5lclxuICAgICAgdGhlbWU9e3RoZW1lIGFzIFRvYXN0ZXJQcm9wc1tcInRoZW1lXCJdfVxuICAgICAgY2xhc3NOYW1lPVwidG9hc3RlciBncm91cFwiXG4gICAgICB0b2FzdE9wdGlvbnM9e3tcbiAgICAgICAgY2xhc3NOYW1lczoge1xuICAgICAgICAgIHRvYXN0OlxuICAgICAgICAgICAgXCJncm91cCB0b2FzdCBncm91cC1bLnRvYXN0ZXJdOmJnLWJhY2tncm91bmQgZ3JvdXAtWy50b2FzdGVyXTp0ZXh0LWZvcmVncm91bmQgZ3JvdXAtWy50b2FzdGVyXTpib3JkZXItYm9yZGVyIGdyb3VwLVsudG9hc3Rlcl06c2hhZG93LWxnXCIsXG4gICAgICAgICAgZGVzY3JpcHRpb246IFwiZ3JvdXAtWy50b2FzdF06dGV4dC1tdXRlZC1mb3JlZ3JvdW5kXCIsXG4gICAgICAgICAgYWN0aW9uQnV0dG9uOlxuICAgICAgICAgICAgXCJncm91cC1bLnRvYXN0XTpiZy1wcmltYXJ5IGdyb3VwLVsudG9hc3RdOnRleHQtcHJpbWFyeS1mb3JlZ3JvdW5kXCIsXG4gICAgICAgICAgY2FuY2VsQnV0dG9uOlxuICAgICAgICAgICAgXCJncm91cC1bLnRvYXN0XTpiZy1tdXRlZCBncm91cC1bLnRvYXN0XTp0ZXh0LW11dGVkLWZvcmVncm91bmRcIixcbiAgICAgICAgfSxcbiAgICAgIH19XG4gICAgICB7Li4ucHJvcHN9XG4gICAgLz5cbiAgKVxufVxuXG5leHBvcnQgeyBUb2FzdGVyLCB0b2FzdCB9XG4iXSwibWFwcGluZ3MiOiI7QUFBQSxTQUFTQSxRQUFRLFFBQVEsYUFBYTtBQUN0QyxTQUFTQyxPQUFPLElBQUlDLE1BQU0sRUFBRUMsS0FBSyxRQUFRLFFBQVE7QUFJakQsTUFBTUYsT0FBTyxHQUFHQSxDQUFDO0VBQUUsR0FBR0c7QUFBb0IsQ0FBQyxLQUFLO0VBQzlDLE1BQU07SUFBRUMsS0FBSyxHQUFHO0VBQVMsQ0FBQyxHQUFHTCxRQUFRLENBQUMsQ0FBQztFQUV2QyxvQkFDRU0sS0FBQSxDQUFBQyxhQUFBLENBQUNMLE1BQU0sRUFBQU0sUUFBQTtJQUNMSCxLQUFLLEVBQUVBLEtBQStCO0lBQ3RDSSxTQUFTLEVBQUMsZUFBZTtJQUN6QkMsWUFBWSxFQUFFO01BQ1pDLFVBQVUsRUFBRTtRQUNWUixLQUFLLEVBQ0gsdUlBQXVJO1FBQ3pJUyxXQUFXLEVBQUUsc0NBQXNDO1FBQ25EQyxZQUFZLEVBQ1Ysa0VBQWtFO1FBQ3BFQyxZQUFZLEVBQ1Y7TUFDSjtJQUNGO0VBQUUsR0FDRVYsS0FBSyxDQUNWLENBQUM7QUFFTixDQUFDO0FBRUQsU0FBU0gsT0FBTyxFQUFFRSxLQUFLIiwiaWdub3JlTGlzdCI6W119