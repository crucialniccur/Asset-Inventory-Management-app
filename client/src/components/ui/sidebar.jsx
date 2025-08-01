function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { PanelLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "../../lib/utils";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Separator } from "../components/ui/separator";
import { Sheet, SheetContent } from "../components/ui/sheet";
import { Skeleton } from "../components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";
const SIDEBAR_COOKIE_NAME = "sidebar:state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";
const SidebarContext = /*#__PURE__*/React.createContext(null);
function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}
const SidebarProvider = /*#__PURE__*/React.forwardRef(({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}, ref) => {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback(value => {
    const openState = typeof value === "function" ? value(open) : value;
    if (setOpenProp) {
      setOpenProp(openState);
    } else {
      _setOpen(openState);
    }

    // This sets the cookie to keep the sidebar state.
    document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
  }, [setOpenProp, open]);

  // Helper to toggle the sidebar.
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile(open => !open) : setOpen(open => !open);
  }, [isMobile, setOpen, setOpenMobile]);

  // Adds a keyboard shortcut to toggle the sidebar.
  React.useEffect(() => {
    const handleKeyDown = event => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open ? "expanded" : "collapsed";
  const contextValue = React.useMemo(() => ({
    state,
    open,
    setOpen,
    isMobile,
    openMobile,
    setOpenMobile,
    toggleSidebar
  }), [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]);
  return /*#__PURE__*/React.createElement(SidebarContext.Provider, {
    value: contextValue
  }, /*#__PURE__*/React.createElement(TooltipProvider, {
    delayDuration: 0
  }, /*#__PURE__*/React.createElement("div", _extends({
    style: {
      "--sidebar-width": SIDEBAR_WIDTH,
      "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
      ...style
    },
    className: cn("group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar", className),
    ref: ref
  }, props), children)));
});
SidebarProvider.displayName = "SidebarProvider";
const Sidebar = /*#__PURE__*/React.forwardRef(({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}, ref) => {
  const {
    isMobile,
    state,
    openMobile,
    setOpenMobile
  } = useSidebar();
  if (collapsible === "none") {
    return /*#__PURE__*/React.createElement("div", _extends({
      className: cn("flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground", className),
      ref: ref
    }, props), children);
  }
  if (isMobile) {
    return /*#__PURE__*/React.createElement(Sheet, _extends({
      open: openMobile,
      onOpenChange: setOpenMobile
    }, props), /*#__PURE__*/React.createElement(SheetContent, {
      "data-sidebar": "sidebar",
      "data-mobile": "true",
      className: "w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden",
      style: {
        "--sidebar-width": SIDEBAR_WIDTH_MOBILE
      },
      side: side
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex h-full w-full flex-col"
    }, children)));
  }
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: "group peer hidden md:block text-sidebar-foreground",
    "data-state": state,
    "data-collapsible": state === "collapsed" ? collapsible : "",
    "data-variant": variant,
    "data-side": side
  }, /*#__PURE__*/React.createElement("div", {
    className: cn("duration-200 relative h-svh w-[--sidebar-width] bg-transparent transition-[width] ease-linear", "group-data-[collapsible=offcanvas]:w-0", "group-data-[side=right]:rotate-180", variant === "floating" || variant === "inset" ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]" : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]")
  }), /*#__PURE__*/React.createElement("div", _extends({
    className: cn("duration-200 fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] ease-linear md:flex", side === "left" ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]" : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
    // Adjust the padding for floating and inset variants.
    variant === "floating" || variant === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]" : "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l", className)
  }, props), /*#__PURE__*/React.createElement("div", {
    "data-sidebar": "sidebar",
    className: "flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow"
  }, children)));
});
Sidebar.displayName = "Sidebar";
const SidebarTrigger = /*#__PURE__*/React.forwardRef(({
  className,
  onClick,
  ...props
}, ref) => {
  const {
    toggleSidebar
  } = useSidebar();
  return /*#__PURE__*/React.createElement(Button, _extends({
    ref: ref,
    "data-sidebar": "trigger",
    variant: "ghost",
    size: "icon",
    className: cn("h-7 w-7", className),
    onClick: event => {
      onClick?.(event);
      toggleSidebar();
    }
  }, props), /*#__PURE__*/React.createElement(PanelLeft, null), /*#__PURE__*/React.createElement("span", {
    className: "sr-only"
  }, "Toggle Sidebar"));
});
SidebarTrigger.displayName = "SidebarTrigger";
const SidebarRail = /*#__PURE__*/React.forwardRef(({
  className,
  ...props
}, ref) => {
  const {
    toggleSidebar
  } = useSidebar();
  return /*#__PURE__*/React.createElement("button", _extends({
    ref: ref,
    "data-sidebar": "rail",
    "aria-label": "Toggle Sidebar",
    tabIndex: -1,
    onClick: toggleSidebar,
    title: "Toggle Sidebar",
    className: cn("absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex", "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize", "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize", "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar", "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2", "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2", className)
  }, props));
});
SidebarRail.displayName = "SidebarRail";
const SidebarInset = /*#__PURE__*/React.forwardRef(({
  className,
  ...props
}, ref) => {
  return /*#__PURE__*/React.createElement("main", _extends({
    ref: ref,
    className: cn("relative flex min-h-svh flex-1 flex-col bg-background", "peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow", className)
  }, props));
});
SidebarInset.displayName = "SidebarInset";
const SidebarInput = /*#__PURE__*/React.forwardRef(({
  className,
  ...props
}, ref) => {
  return /*#__PURE__*/React.createElement(Input, _extends({
    ref: ref,
    "data-sidebar": "input",
    className: cn("h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring", className)
  }, props));
});
SidebarInput.displayName = "SidebarInput";
const SidebarHeader = /*#__PURE__*/React.forwardRef(({
  className,
  ...props
}, ref) => {
  return /*#__PURE__*/React.createElement("div", _extends({
    ref: ref,
    "data-sidebar": "header",
    className: cn("flex flex-col gap-2 p-2", className)
  }, props));
});
SidebarHeader.displayName = "SidebarHeader";
const SidebarFooter = /*#__PURE__*/React.forwardRef(({
  className,
  ...props
}, ref) => {
  return /*#__PURE__*/React.createElement("div", _extends({
    ref: ref,
    "data-sidebar": "footer",
    className: cn("flex flex-col gap-2 p-2", className)
  }, props));
});
SidebarFooter.displayName = "SidebarFooter";
const SidebarSeparator = /*#__PURE__*/React.forwardRef(({
  className,
  ...props
}, ref) => {
  return /*#__PURE__*/React.createElement(Separator, _extends({
    ref: ref,
    "data-sidebar": "separator",
    className: cn("mx-2 w-auto bg-sidebar-border", className)
  }, props));
});
SidebarSeparator.displayName = "SidebarSeparator";
const SidebarContent = /*#__PURE__*/React.forwardRef(({
  className,
  ...props
}, ref) => {
  return /*#__PURE__*/React.createElement("div", _extends({
    ref: ref,
    "data-sidebar": "content",
    className: cn("flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden", className)
  }, props));
});
SidebarContent.displayName = "SidebarContent";
const SidebarGroup = /*#__PURE__*/React.forwardRef(({
  className,
  ...props
}, ref) => {
  return /*#__PURE__*/React.createElement("div", _extends({
    ref: ref,
    "data-sidebar": "group",
    className: cn("relative flex w-full min-w-0 flex-col p-2", className)
  }, props));
});
SidebarGroup.displayName = "SidebarGroup";
const SidebarGroupLabel = /*#__PURE__*/React.forwardRef(({
  className,
  asChild = false,
  ...props
}, ref) => {
  const Comp = asChild ? Slot : "div";
  return /*#__PURE__*/React.createElement(Comp, _extends({
    ref: ref,
    "data-sidebar": "group-label",
    className: cn("duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0", "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0", className)
  }, props));
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";
const SidebarGroupAction = /*#__PURE__*/React.forwardRef(({
  className,
  asChild = false,
  ...props
}, ref) => {
  const Comp = asChild ? Slot : "button";
  return /*#__PURE__*/React.createElement(Comp, _extends({
    ref: ref,
    "data-sidebar": "group-action",
    className: cn("absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
    // Increases the hit area of the button on mobile.
    "after:absolute after:-inset-2 after:md:hidden", "group-data-[collapsible=icon]:hidden", className)
  }, props));
});
SidebarGroupAction.displayName = "SidebarGroupAction";
const SidebarGroupContent = /*#__PURE__*/React.forwardRef(({
  className,
  ...props
}, ref) => /*#__PURE__*/React.createElement("div", _extends({
  ref: ref,
  "data-sidebar": "group-content",
  className: cn("w-full text-sm", className)
}, props)));
SidebarGroupContent.displayName = "SidebarGroupContent";
const SidebarMenu = /*#__PURE__*/React.forwardRef(({
  className,
  ...props
}, ref) => /*#__PURE__*/React.createElement("ul", _extends({
  ref: ref,
  "data-sidebar": "menu",
  className: cn("flex w-full min-w-0 flex-col gap-1", className)
}, props)));
SidebarMenu.displayName = "SidebarMenu";
const SidebarMenuItem = /*#__PURE__*/React.forwardRef(({
  className,
  ...props
}, ref) => /*#__PURE__*/React.createElement("li", _extends({
  ref: ref,
  "data-sidebar": "menu-item",
  className: cn("group/menu-item relative", className)
}, props)));
SidebarMenuItem.displayName = "SidebarMenuItem";
const sidebarMenuButtonVariants = cva("peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0", {
  variants: {
    variant: {
      default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      outline: "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]"
    },
    size: {
      default: "h-8 text-sm",
      sm: "h-7 text-xs",
      lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0"
    }
  },
  defaultVariants: {
    variant: "default",
    size: "default"
  }
});
const SidebarMenuButton = /*#__PURE__*/React.forwardRef(({
  asChild = false,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  ...props
}, ref) => {
  const Comp = asChild ? Slot : "button";
  const {
    isMobile,
    state
  } = useSidebar();
  const button = /*#__PURE__*/React.createElement(Comp, _extends({
    ref: ref,
    "data-sidebar": "menu-button",
    "data-size": size,
    "data-active": isActive,
    className: cn(sidebarMenuButtonVariants({
      variant,
      size
    }), className)
  }, props));
  if (!tooltip) {
    return button;
  }
  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip
    };
  }
  return /*#__PURE__*/React.createElement(Tooltip, null, /*#__PURE__*/React.createElement(TooltipTrigger, {
    asChild: true
  }, button), /*#__PURE__*/React.createElement(TooltipContent, _extends({
    side: "right",
    align: "center",
    hidden: state !== "collapsed" || isMobile
  }, tooltip)));
});
SidebarMenuButton.displayName = "SidebarMenuButton";
const SidebarMenuAction = /*#__PURE__*/React.forwardRef(({
  className,
  asChild = false,
  showOnHover = false,
  ...props
}, ref) => {
  const Comp = asChild ? Slot : "button";
  return /*#__PURE__*/React.createElement(Comp, _extends({
    ref: ref,
    "data-sidebar": "menu-action",
    className: cn("absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
    // Increases the hit area of the button on mobile.
    "after:absolute after:-inset-2 after:md:hidden", "peer-data-[size=sm]/menu-button:top-1", "peer-data-[size=default]/menu-button:top-1.5", "peer-data-[size=lg]/menu-button:top-2.5", "group-data-[collapsible=icon]:hidden", showOnHover && "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0", className)
  }, props));
});
SidebarMenuAction.displayName = "SidebarMenuAction";
const SidebarMenuBadge = /*#__PURE__*/React.forwardRef(({
  className,
  ...props
}, ref) => /*#__PURE__*/React.createElement("div", _extends({
  ref: ref,
  "data-sidebar": "menu-badge",
  className: cn("absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground select-none pointer-events-none", "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground", "peer-data-[size=sm]/menu-button:top-1", "peer-data-[size=default]/menu-button:top-1.5", "peer-data-[size=lg]/menu-button:top-2.5", "group-data-[collapsible=icon]:hidden", className)
}, props)));
SidebarMenuBadge.displayName = "SidebarMenuBadge";
const SidebarMenuSkeleton = /*#__PURE__*/React.forwardRef(({
  className,
  showIcon = false,
  ...props
}, ref) => {
  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  }, []);
  return /*#__PURE__*/React.createElement("div", _extends({
    ref: ref,
    "data-sidebar": "menu-skeleton",
    className: cn("rounded-md h-8 flex gap-2 px-2 items-center", className)
  }, props), showIcon && /*#__PURE__*/React.createElement(Skeleton, {
    className: "size-4 rounded-md",
    "data-sidebar": "menu-skeleton-icon"
  }), /*#__PURE__*/React.createElement(Skeleton, {
    className: "h-4 flex-1 max-w-[--skeleton-width]",
    "data-sidebar": "menu-skeleton-text",
    style: {
      "--skeleton-width": width
    }
  }));
});
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton";
const SidebarMenuSub = /*#__PURE__*/React.forwardRef(({
  className,
  ...props
}, ref) => /*#__PURE__*/React.createElement("ul", _extends({
  ref: ref,
  "data-sidebar": "menu-sub",
  className: cn("mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5", "group-data-[collapsible=icon]:hidden", className)
}, props)));
SidebarMenuSub.displayName = "SidebarMenuSub";
const SidebarMenuSubItem = /*#__PURE__*/React.forwardRef(({
  ...props
}, ref) => /*#__PURE__*/React.createElement("li", _extends({
  ref: ref
}, props)));
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";
const SidebarMenuSubButton = /*#__PURE__*/React.forwardRef(({
  asChild = false,
  size = "md",
  isActive,
  className,
  ...props
}, ref) => {
  const Comp = asChild ? Slot : "a";
  return /*#__PURE__*/React.createElement(Comp, _extends({
    ref: ref,
    "data-sidebar": "menu-sub-button",
    "data-size": size,
    "data-active": isActive,
    className: cn("flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground", "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground", size === "sm" && "text-xs", size === "md" && "text-sm", "group-data-[collapsible=icon]:hidden", className)
  }, props));
});
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";
export { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInput, SidebarInset, SidebarMenu, SidebarMenuAction, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarMenuSkeleton, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarProvider, SidebarRail, SidebarSeparator, SidebarTrigger, useSidebar };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJSZWFjdCIsIlNsb3QiLCJjdmEiLCJQYW5lbExlZnQiLCJ1c2VJc01vYmlsZSIsImNuIiwiQnV0dG9uIiwiSW5wdXQiLCJTZXBhcmF0b3IiLCJTaGVldCIsIlNoZWV0Q29udGVudCIsIlNrZWxldG9uIiwiVG9vbHRpcCIsIlRvb2x0aXBDb250ZW50IiwiVG9vbHRpcFByb3ZpZGVyIiwiVG9vbHRpcFRyaWdnZXIiLCJTSURFQkFSX0NPT0tJRV9OQU1FIiwiU0lERUJBUl9DT09LSUVfTUFYX0FHRSIsIlNJREVCQVJfV0lEVEgiLCJTSURFQkFSX1dJRFRIX01PQklMRSIsIlNJREVCQVJfV0lEVEhfSUNPTiIsIlNJREVCQVJfS0VZQk9BUkRfU0hPUlRDVVQiLCJTaWRlYmFyQ29udGV4dCIsImNyZWF0ZUNvbnRleHQiLCJ1c2VTaWRlYmFyIiwiY29udGV4dCIsInVzZUNvbnRleHQiLCJFcnJvciIsIlNpZGViYXJQcm92aWRlciIsImZvcndhcmRSZWYiLCJkZWZhdWx0T3BlbiIsIm9wZW4iLCJvcGVuUHJvcCIsIm9uT3BlbkNoYW5nZSIsInNldE9wZW5Qcm9wIiwiY2xhc3NOYW1lIiwic3R5bGUiLCJjaGlsZHJlbiIsInByb3BzIiwicmVmIiwiaXNNb2JpbGUiLCJvcGVuTW9iaWxlIiwic2V0T3Blbk1vYmlsZSIsInVzZVN0YXRlIiwiX29wZW4iLCJfc2V0T3BlbiIsInNldE9wZW4iLCJ1c2VDYWxsYmFjayIsInZhbHVlIiwib3BlblN0YXRlIiwiZG9jdW1lbnQiLCJjb29raWUiLCJ0b2dnbGVTaWRlYmFyIiwidXNlRWZmZWN0IiwiaGFuZGxlS2V5RG93biIsImV2ZW50Iiwia2V5IiwibWV0YUtleSIsImN0cmxLZXkiLCJwcmV2ZW50RGVmYXVsdCIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwic3RhdGUiLCJjb250ZXh0VmFsdWUiLCJ1c2VNZW1vIiwiY3JlYXRlRWxlbWVudCIsIlByb3ZpZGVyIiwiZGVsYXlEdXJhdGlvbiIsIl9leHRlbmRzIiwiZGlzcGxheU5hbWUiLCJTaWRlYmFyIiwic2lkZSIsInZhcmlhbnQiLCJjb2xsYXBzaWJsZSIsIlNpZGViYXJUcmlnZ2VyIiwib25DbGljayIsInNpemUiLCJTaWRlYmFyUmFpbCIsInRhYkluZGV4IiwidGl0bGUiLCJTaWRlYmFySW5zZXQiLCJTaWRlYmFySW5wdXQiLCJTaWRlYmFySGVhZGVyIiwiU2lkZWJhckZvb3RlciIsIlNpZGViYXJTZXBhcmF0b3IiLCJTaWRlYmFyQ29udGVudCIsIlNpZGViYXJHcm91cCIsIlNpZGViYXJHcm91cExhYmVsIiwiYXNDaGlsZCIsIkNvbXAiLCJTaWRlYmFyR3JvdXBBY3Rpb24iLCJTaWRlYmFyR3JvdXBDb250ZW50IiwiU2lkZWJhck1lbnUiLCJTaWRlYmFyTWVudUl0ZW0iLCJzaWRlYmFyTWVudUJ1dHRvblZhcmlhbnRzIiwidmFyaWFudHMiLCJkZWZhdWx0Iiwib3V0bGluZSIsInNtIiwibGciLCJkZWZhdWx0VmFyaWFudHMiLCJTaWRlYmFyTWVudUJ1dHRvbiIsImlzQWN0aXZlIiwidG9vbHRpcCIsImJ1dHRvbiIsImFsaWduIiwiaGlkZGVuIiwiU2lkZWJhck1lbnVBY3Rpb24iLCJzaG93T25Ib3ZlciIsIlNpZGViYXJNZW51QmFkZ2UiLCJTaWRlYmFyTWVudVNrZWxldG9uIiwic2hvd0ljb24iLCJ3aWR0aCIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsIlNpZGViYXJNZW51U3ViIiwiU2lkZWJhck1lbnVTdWJJdGVtIiwiU2lkZWJhck1lbnVTdWJCdXR0b24iXSwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy91aS9zaWRlYmFyLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIlxuaW1wb3J0IHsgU2xvdCB9IGZyb20gXCJAcmFkaXgtdWkvcmVhY3Qtc2xvdFwiXG5pbXBvcnQgeyBWYXJpYW50UHJvcHMsIGN2YSB9IGZyb20gXCJjbGFzcy12YXJpYW5jZS1hdXRob3JpdHlcIlxuaW1wb3J0IHsgUGFuZWxMZWZ0IH0gZnJvbSBcImx1Y2lkZS1yZWFjdFwiXG5cbmltcG9ydCB7IHVzZUlzTW9iaWxlIH0gZnJvbSBcIkAvaG9va3MvdXNlLW1vYmlsZVwiXG5pbXBvcnQgeyBjbiB9IGZyb20gXCJAL2xpYi91dGlsc1wiXG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tIFwiQC9jb21wb25lbnRzL3VpL2J1dHRvblwiXG5pbXBvcnQgeyBJbnB1dCB9IGZyb20gXCJAL2NvbXBvbmVudHMvdWkvaW5wdXRcIlxuaW1wb3J0IHsgU2VwYXJhdG9yIH0gZnJvbSBcIkAvY29tcG9uZW50cy91aS9zZXBhcmF0b3JcIlxuaW1wb3J0IHsgU2hlZXQsIFNoZWV0Q29udGVudCB9IGZyb20gXCJAL2NvbXBvbmVudHMvdWkvc2hlZXRcIlxuaW1wb3J0IHsgU2tlbGV0b24gfSBmcm9tIFwiQC9jb21wb25lbnRzL3VpL3NrZWxldG9uXCJcbmltcG9ydCB7XG4gIFRvb2x0aXAsXG4gIFRvb2x0aXBDb250ZW50LFxuICBUb29sdGlwUHJvdmlkZXIsXG4gIFRvb2x0aXBUcmlnZ2VyLFxufSBmcm9tIFwiQC9jb21wb25lbnRzL3VpL3Rvb2x0aXBcIlxuXG5jb25zdCBTSURFQkFSX0NPT0tJRV9OQU1FID0gXCJzaWRlYmFyOnN0YXRlXCJcbmNvbnN0IFNJREVCQVJfQ09PS0lFX01BWF9BR0UgPSA2MCAqIDYwICogMjQgKiA3XG5jb25zdCBTSURFQkFSX1dJRFRIID0gXCIxNnJlbVwiXG5jb25zdCBTSURFQkFSX1dJRFRIX01PQklMRSA9IFwiMThyZW1cIlxuY29uc3QgU0lERUJBUl9XSURUSF9JQ09OID0gXCIzcmVtXCJcbmNvbnN0IFNJREVCQVJfS0VZQk9BUkRfU0hPUlRDVVQgPSBcImJcIlxuXG50eXBlIFNpZGViYXJDb250ZXh0ID0ge1xuICBzdGF0ZTogXCJleHBhbmRlZFwiIHwgXCJjb2xsYXBzZWRcIlxuICBvcGVuOiBib29sZWFuXG4gIHNldE9wZW46IChvcGVuOiBib29sZWFuKSA9PiB2b2lkXG4gIG9wZW5Nb2JpbGU6IGJvb2xlYW5cbiAgc2V0T3Blbk1vYmlsZTogKG9wZW46IGJvb2xlYW4pID0+IHZvaWRcbiAgaXNNb2JpbGU6IGJvb2xlYW5cbiAgdG9nZ2xlU2lkZWJhcjogKCkgPT4gdm9pZFxufVxuXG5jb25zdCBTaWRlYmFyQ29udGV4dCA9IFJlYWN0LmNyZWF0ZUNvbnRleHQ8U2lkZWJhckNvbnRleHQgfCBudWxsPihudWxsKVxuXG5mdW5jdGlvbiB1c2VTaWRlYmFyKCkge1xuICBjb25zdCBjb250ZXh0ID0gUmVhY3QudXNlQ29udGV4dChTaWRlYmFyQ29udGV4dClcbiAgaWYgKCFjb250ZXh0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwidXNlU2lkZWJhciBtdXN0IGJlIHVzZWQgd2l0aGluIGEgU2lkZWJhclByb3ZpZGVyLlwiKVxuICB9XG5cbiAgcmV0dXJuIGNvbnRleHRcbn1cblxuY29uc3QgU2lkZWJhclByb3ZpZGVyID0gUmVhY3QuZm9yd2FyZFJlZjxcbiAgSFRNTERpdkVsZW1lbnQsXG4gIFJlYWN0LkNvbXBvbmVudFByb3BzPFwiZGl2XCI+ICYge1xuICAgIGRlZmF1bHRPcGVuPzogYm9vbGVhblxuICAgIG9wZW4/OiBib29sZWFuXG4gICAgb25PcGVuQ2hhbmdlPzogKG9wZW46IGJvb2xlYW4pID0+IHZvaWRcbiAgfVxuPihcbiAgKFxuICAgIHtcbiAgICAgIGRlZmF1bHRPcGVuID0gdHJ1ZSxcbiAgICAgIG9wZW46IG9wZW5Qcm9wLFxuICAgICAgb25PcGVuQ2hhbmdlOiBzZXRPcGVuUHJvcCxcbiAgICAgIGNsYXNzTmFtZSxcbiAgICAgIHN0eWxlLFxuICAgICAgY2hpbGRyZW4sXG4gICAgICAuLi5wcm9wc1xuICAgIH0sXG4gICAgcmVmXG4gICkgPT4ge1xuICAgIGNvbnN0IGlzTW9iaWxlID0gdXNlSXNNb2JpbGUoKVxuICAgIGNvbnN0IFtvcGVuTW9iaWxlLCBzZXRPcGVuTW9iaWxlXSA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKVxuXG4gICAgLy8gVGhpcyBpcyB0aGUgaW50ZXJuYWwgc3RhdGUgb2YgdGhlIHNpZGViYXIuXG4gICAgLy8gV2UgdXNlIG9wZW5Qcm9wIGFuZCBzZXRPcGVuUHJvcCBmb3IgY29udHJvbCBmcm9tIG91dHNpZGUgdGhlIGNvbXBvbmVudC5cbiAgICBjb25zdCBbX29wZW4sIF9zZXRPcGVuXSA9IFJlYWN0LnVzZVN0YXRlKGRlZmF1bHRPcGVuKVxuICAgIGNvbnN0IG9wZW4gPSBvcGVuUHJvcCA/PyBfb3BlblxuICAgIGNvbnN0IHNldE9wZW4gPSBSZWFjdC51c2VDYWxsYmFjayhcbiAgICAgICh2YWx1ZTogYm9vbGVhbiB8ICgodmFsdWU6IGJvb2xlYW4pID0+IGJvb2xlYW4pKSA9PiB7XG4gICAgICAgIGNvbnN0IG9wZW5TdGF0ZSA9IHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiID8gdmFsdWUob3BlbikgOiB2YWx1ZVxuICAgICAgICBpZiAoc2V0T3BlblByb3ApIHtcbiAgICAgICAgICBzZXRPcGVuUHJvcChvcGVuU3RhdGUpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgX3NldE9wZW4ob3BlblN0YXRlKVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGhpcyBzZXRzIHRoZSBjb29raWUgdG8ga2VlcCB0aGUgc2lkZWJhciBzdGF0ZS5cbiAgICAgICAgZG9jdW1lbnQuY29va2llID0gYCR7U0lERUJBUl9DT09LSUVfTkFNRX09JHtvcGVuU3RhdGV9OyBwYXRoPS87IG1heC1hZ2U9JHtTSURFQkFSX0NPT0tJRV9NQVhfQUdFfWBcbiAgICAgIH0sXG4gICAgICBbc2V0T3BlblByb3AsIG9wZW5dXG4gICAgKVxuXG4gICAgLy8gSGVscGVyIHRvIHRvZ2dsZSB0aGUgc2lkZWJhci5cbiAgICBjb25zdCB0b2dnbGVTaWRlYmFyID0gUmVhY3QudXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgICAgcmV0dXJuIGlzTW9iaWxlXG4gICAgICAgID8gc2V0T3Blbk1vYmlsZSgob3BlbikgPT4gIW9wZW4pXG4gICAgICAgIDogc2V0T3Blbigob3BlbikgPT4gIW9wZW4pXG4gICAgfSwgW2lzTW9iaWxlLCBzZXRPcGVuLCBzZXRPcGVuTW9iaWxlXSlcblxuICAgIC8vIEFkZHMgYSBrZXlib2FyZCBzaG9ydGN1dCB0byB0b2dnbGUgdGhlIHNpZGViYXIuXG4gICAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICAgIGNvbnN0IGhhbmRsZUtleURvd24gPSAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIGV2ZW50LmtleSA9PT0gU0lERUJBUl9LRVlCT0FSRF9TSE9SVENVVCAmJlxuICAgICAgICAgIChldmVudC5tZXRhS2V5IHx8IGV2ZW50LmN0cmxLZXkpXG4gICAgICAgICkge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICB0b2dnbGVTaWRlYmFyKClcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgaGFuZGxlS2V5RG93bilcbiAgICAgIHJldHVybiAoKSA9PiB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgaGFuZGxlS2V5RG93bilcbiAgICB9LCBbdG9nZ2xlU2lkZWJhcl0pXG5cbiAgICAvLyBXZSBhZGQgYSBzdGF0ZSBzbyB0aGF0IHdlIGNhbiBkbyBkYXRhLXN0YXRlPVwiZXhwYW5kZWRcIiBvciBcImNvbGxhcHNlZFwiLlxuICAgIC8vIFRoaXMgbWFrZXMgaXQgZWFzaWVyIHRvIHN0eWxlIHRoZSBzaWRlYmFyIHdpdGggVGFpbHdpbmQgY2xhc3Nlcy5cbiAgICBjb25zdCBzdGF0ZSA9IG9wZW4gPyBcImV4cGFuZGVkXCIgOiBcImNvbGxhcHNlZFwiXG5cbiAgICBjb25zdCBjb250ZXh0VmFsdWUgPSBSZWFjdC51c2VNZW1vPFNpZGViYXJDb250ZXh0PihcbiAgICAgICgpID0+ICh7XG4gICAgICAgIHN0YXRlLFxuICAgICAgICBvcGVuLFxuICAgICAgICBzZXRPcGVuLFxuICAgICAgICBpc01vYmlsZSxcbiAgICAgICAgb3Blbk1vYmlsZSxcbiAgICAgICAgc2V0T3Blbk1vYmlsZSxcbiAgICAgICAgdG9nZ2xlU2lkZWJhcixcbiAgICAgIH0pLFxuICAgICAgW3N0YXRlLCBvcGVuLCBzZXRPcGVuLCBpc01vYmlsZSwgb3Blbk1vYmlsZSwgc2V0T3Blbk1vYmlsZSwgdG9nZ2xlU2lkZWJhcl1cbiAgICApXG5cbiAgICByZXR1cm4gKFxuICAgICAgPFNpZGViYXJDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXtjb250ZXh0VmFsdWV9PlxuICAgICAgICA8VG9vbHRpcFByb3ZpZGVyIGRlbGF5RHVyYXRpb249ezB9PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIHN0eWxlPXtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiLS1zaWRlYmFyLXdpZHRoXCI6IFNJREVCQVJfV0lEVEgsXG4gICAgICAgICAgICAgICAgXCItLXNpZGViYXItd2lkdGgtaWNvblwiOiBTSURFQkFSX1dJRFRIX0lDT04sXG4gICAgICAgICAgICAgICAgLi4uc3R5bGUsXG4gICAgICAgICAgICAgIH0gYXMgUmVhY3QuQ1NTUHJvcGVydGllc1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2xhc3NOYW1lPXtjbihcbiAgICAgICAgICAgICAgXCJncm91cC9zaWRlYmFyLXdyYXBwZXIgZmxleCBtaW4taC1zdmggdy1mdWxsIGhhcy1bW2RhdGEtdmFyaWFudD1pbnNldF1dOmJnLXNpZGViYXJcIixcbiAgICAgICAgICAgICAgY2xhc3NOYW1lXG4gICAgICAgICAgICApfVxuICAgICAgICAgICAgcmVmPXtyZWZ9XG4gICAgICAgICAgICB7Li4ucHJvcHN9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge2NoaWxkcmVufVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L1Rvb2x0aXBQcm92aWRlcj5cbiAgICAgIDwvU2lkZWJhckNvbnRleHQuUHJvdmlkZXI+XG4gICAgKVxuICB9XG4pXG5TaWRlYmFyUHJvdmlkZXIuZGlzcGxheU5hbWUgPSBcIlNpZGViYXJQcm92aWRlclwiXG5cbmNvbnN0IFNpZGViYXIgPSBSZWFjdC5mb3J3YXJkUmVmPFxuICBIVE1MRGl2RWxlbWVudCxcbiAgUmVhY3QuQ29tcG9uZW50UHJvcHM8XCJkaXZcIj4gJiB7XG4gICAgc2lkZT86IFwibGVmdFwiIHwgXCJyaWdodFwiXG4gICAgdmFyaWFudD86IFwic2lkZWJhclwiIHwgXCJmbG9hdGluZ1wiIHwgXCJpbnNldFwiXG4gICAgY29sbGFwc2libGU/OiBcIm9mZmNhbnZhc1wiIHwgXCJpY29uXCIgfCBcIm5vbmVcIlxuICB9XG4+KFxuICAoXG4gICAge1xuICAgICAgc2lkZSA9IFwibGVmdFwiLFxuICAgICAgdmFyaWFudCA9IFwic2lkZWJhclwiLFxuICAgICAgY29sbGFwc2libGUgPSBcIm9mZmNhbnZhc1wiLFxuICAgICAgY2xhc3NOYW1lLFxuICAgICAgY2hpbGRyZW4sXG4gICAgICAuLi5wcm9wc1xuICAgIH0sXG4gICAgcmVmXG4gICkgPT4ge1xuICAgIGNvbnN0IHsgaXNNb2JpbGUsIHN0YXRlLCBvcGVuTW9iaWxlLCBzZXRPcGVuTW9iaWxlIH0gPSB1c2VTaWRlYmFyKClcblxuICAgIGlmIChjb2xsYXBzaWJsZSA9PT0gXCJub25lXCIpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzc05hbWU9e2NuKFxuICAgICAgICAgICAgXCJmbGV4IGgtZnVsbCB3LVstLXNpZGViYXItd2lkdGhdIGZsZXgtY29sIGJnLXNpZGViYXIgdGV4dC1zaWRlYmFyLWZvcmVncm91bmRcIixcbiAgICAgICAgICAgIGNsYXNzTmFtZVxuICAgICAgICAgICl9XG4gICAgICAgICAgcmVmPXtyZWZ9XG4gICAgICAgICAgey4uLnByb3BzfVxuICAgICAgICA+XG4gICAgICAgICAge2NoaWxkcmVufVxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9XG5cbiAgICBpZiAoaXNNb2JpbGUpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxTaGVldCBvcGVuPXtvcGVuTW9iaWxlfSBvbk9wZW5DaGFuZ2U9e3NldE9wZW5Nb2JpbGV9IHsuLi5wcm9wc30+XG4gICAgICAgICAgPFNoZWV0Q29udGVudFxuICAgICAgICAgICAgZGF0YS1zaWRlYmFyPVwic2lkZWJhclwiXG4gICAgICAgICAgICBkYXRhLW1vYmlsZT1cInRydWVcIlxuICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1bLS1zaWRlYmFyLXdpZHRoXSBiZy1zaWRlYmFyIHAtMCB0ZXh0LXNpZGViYXItZm9yZWdyb3VuZCBbJj5idXR0b25dOmhpZGRlblwiXG4gICAgICAgICAgICBzdHlsZT17XG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIi0tc2lkZWJhci13aWR0aFwiOiBTSURFQkFSX1dJRFRIX01PQklMRSxcbiAgICAgICAgICAgICAgfSBhcyBSZWFjdC5DU1NQcm9wZXJ0aWVzXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzaWRlPXtzaWRlfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBoLWZ1bGwgdy1mdWxsIGZsZXgtY29sXCI+e2NoaWxkcmVufTwvZGl2PlxuICAgICAgICAgIDwvU2hlZXRDb250ZW50PlxuICAgICAgICA8L1NoZWV0PlxuICAgICAgKVxuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIHJlZj17cmVmfVxuICAgICAgICBjbGFzc05hbWU9XCJncm91cCBwZWVyIGhpZGRlbiBtZDpibG9jayB0ZXh0LXNpZGViYXItZm9yZWdyb3VuZFwiXG4gICAgICAgIGRhdGEtc3RhdGU9e3N0YXRlfVxuICAgICAgICBkYXRhLWNvbGxhcHNpYmxlPXtzdGF0ZSA9PT0gXCJjb2xsYXBzZWRcIiA/IGNvbGxhcHNpYmxlIDogXCJcIn1cbiAgICAgICAgZGF0YS12YXJpYW50PXt2YXJpYW50fVxuICAgICAgICBkYXRhLXNpZGU9e3NpZGV9XG4gICAgICA+XG4gICAgICAgIHsvKiBUaGlzIGlzIHdoYXQgaGFuZGxlcyB0aGUgc2lkZWJhciBnYXAgb24gZGVza3RvcCAqL31cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT17Y24oXG4gICAgICAgICAgICBcImR1cmF0aW9uLTIwMCByZWxhdGl2ZSBoLXN2aCB3LVstLXNpZGViYXItd2lkdGhdIGJnLXRyYW5zcGFyZW50IHRyYW5zaXRpb24tW3dpZHRoXSBlYXNlLWxpbmVhclwiLFxuICAgICAgICAgICAgXCJncm91cC1kYXRhLVtjb2xsYXBzaWJsZT1vZmZjYW52YXNdOnctMFwiLFxuICAgICAgICAgICAgXCJncm91cC1kYXRhLVtzaWRlPXJpZ2h0XTpyb3RhdGUtMTgwXCIsXG4gICAgICAgICAgICB2YXJpYW50ID09PSBcImZsb2F0aW5nXCIgfHwgdmFyaWFudCA9PT0gXCJpbnNldFwiXG4gICAgICAgICAgICAgID8gXCJncm91cC1kYXRhLVtjb2xsYXBzaWJsZT1pY29uXTp3LVtjYWxjKHZhcigtLXNpZGViYXItd2lkdGgtaWNvbilfK190aGVtZShzcGFjaW5nLjQpKV1cIlxuICAgICAgICAgICAgICA6IFwiZ3JvdXAtZGF0YS1bY29sbGFwc2libGU9aWNvbl06dy1bLS1zaWRlYmFyLXdpZHRoLWljb25dXCJcbiAgICAgICAgICApfVxuICAgICAgICAvPlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgY2xhc3NOYW1lPXtjbihcbiAgICAgICAgICAgIFwiZHVyYXRpb24tMjAwIGZpeGVkIGluc2V0LXktMCB6LTEwIGhpZGRlbiBoLXN2aCB3LVstLXNpZGViYXItd2lkdGhdIHRyYW5zaXRpb24tW2xlZnQscmlnaHQsd2lkdGhdIGVhc2UtbGluZWFyIG1kOmZsZXhcIixcbiAgICAgICAgICAgIHNpZGUgPT09IFwibGVmdFwiXG4gICAgICAgICAgICAgID8gXCJsZWZ0LTAgZ3JvdXAtZGF0YS1bY29sbGFwc2libGU9b2ZmY2FudmFzXTpsZWZ0LVtjYWxjKHZhcigtLXNpZGViYXItd2lkdGgpKi0xKV1cIlxuICAgICAgICAgICAgICA6IFwicmlnaHQtMCBncm91cC1kYXRhLVtjb2xsYXBzaWJsZT1vZmZjYW52YXNdOnJpZ2h0LVtjYWxjKHZhcigtLXNpZGViYXItd2lkdGgpKi0xKV1cIixcbiAgICAgICAgICAgIC8vIEFkanVzdCB0aGUgcGFkZGluZyBmb3IgZmxvYXRpbmcgYW5kIGluc2V0IHZhcmlhbnRzLlxuICAgICAgICAgICAgdmFyaWFudCA9PT0gXCJmbG9hdGluZ1wiIHx8IHZhcmlhbnQgPT09IFwiaW5zZXRcIlxuICAgICAgICAgICAgICA/IFwicC0yIGdyb3VwLWRhdGEtW2NvbGxhcHNpYmxlPWljb25dOnctW2NhbGModmFyKC0tc2lkZWJhci13aWR0aC1pY29uKV8rX3RoZW1lKHNwYWNpbmcuNClfKzJweCldXCJcbiAgICAgICAgICAgICAgOiBcImdyb3VwLWRhdGEtW2NvbGxhcHNpYmxlPWljb25dOnctWy0tc2lkZWJhci13aWR0aC1pY29uXSBncm91cC1kYXRhLVtzaWRlPWxlZnRdOmJvcmRlci1yIGdyb3VwLWRhdGEtW3NpZGU9cmlnaHRdOmJvcmRlci1sXCIsXG4gICAgICAgICAgICBjbGFzc05hbWVcbiAgICAgICAgICApfVxuICAgICAgICAgIHsuLi5wcm9wc31cbiAgICAgICAgPlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGRhdGEtc2lkZWJhcj1cInNpZGViYXJcIlxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmxleCBoLWZ1bGwgdy1mdWxsIGZsZXgtY29sIGJnLXNpZGViYXIgZ3JvdXAtZGF0YS1bdmFyaWFudD1mbG9hdGluZ106cm91bmRlZC1sZyBncm91cC1kYXRhLVt2YXJpYW50PWZsb2F0aW5nXTpib3JkZXIgZ3JvdXAtZGF0YS1bdmFyaWFudD1mbG9hdGluZ106Ym9yZGVyLXNpZGViYXItYm9yZGVyIGdyb3VwLWRhdGEtW3ZhcmlhbnQ9ZmxvYXRpbmddOnNoYWRvd1wiXG4gICAgICAgICAgPlxuICAgICAgICAgICAge2NoaWxkcmVufVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuKVxuU2lkZWJhci5kaXNwbGF5TmFtZSA9IFwiU2lkZWJhclwiXG5cbmNvbnN0IFNpZGViYXJUcmlnZ2VyID0gUmVhY3QuZm9yd2FyZFJlZjxcbiAgUmVhY3QuRWxlbWVudFJlZjx0eXBlb2YgQnV0dG9uPixcbiAgUmVhY3QuQ29tcG9uZW50UHJvcHM8dHlwZW9mIEJ1dHRvbj5cbj4oKHsgY2xhc3NOYW1lLCBvbkNsaWNrLCAuLi5wcm9wcyB9LCByZWYpID0+IHtcbiAgY29uc3QgeyB0b2dnbGVTaWRlYmFyIH0gPSB1c2VTaWRlYmFyKClcblxuICByZXR1cm4gKFxuICAgIDxCdXR0b25cbiAgICAgIHJlZj17cmVmfVxuICAgICAgZGF0YS1zaWRlYmFyPVwidHJpZ2dlclwiXG4gICAgICB2YXJpYW50PVwiZ2hvc3RcIlxuICAgICAgc2l6ZT1cImljb25cIlxuICAgICAgY2xhc3NOYW1lPXtjbihcImgtNyB3LTdcIiwgY2xhc3NOYW1lKX1cbiAgICAgIG9uQ2xpY2s9eyhldmVudCkgPT4ge1xuICAgICAgICBvbkNsaWNrPy4oZXZlbnQpXG4gICAgICAgIHRvZ2dsZVNpZGViYXIoKVxuICAgICAgfX1cbiAgICAgIHsuLi5wcm9wc31cbiAgICA+XG4gICAgICA8UGFuZWxMZWZ0IC8+XG4gICAgICA8c3BhbiBjbGFzc05hbWU9XCJzci1vbmx5XCI+VG9nZ2xlIFNpZGViYXI8L3NwYW4+XG4gICAgPC9CdXR0b24+XG4gIClcbn0pXG5TaWRlYmFyVHJpZ2dlci5kaXNwbGF5TmFtZSA9IFwiU2lkZWJhclRyaWdnZXJcIlxuXG5jb25zdCBTaWRlYmFyUmFpbCA9IFJlYWN0LmZvcndhcmRSZWY8XG4gIEhUTUxCdXR0b25FbGVtZW50LFxuICBSZWFjdC5Db21wb25lbnRQcm9wczxcImJ1dHRvblwiPlxuPigoeyBjbGFzc05hbWUsIC4uLnByb3BzIH0sIHJlZikgPT4ge1xuICBjb25zdCB7IHRvZ2dsZVNpZGViYXIgfSA9IHVzZVNpZGViYXIoKVxuXG4gIHJldHVybiAoXG4gICAgPGJ1dHRvblxuICAgICAgcmVmPXtyZWZ9XG4gICAgICBkYXRhLXNpZGViYXI9XCJyYWlsXCJcbiAgICAgIGFyaWEtbGFiZWw9XCJUb2dnbGUgU2lkZWJhclwiXG4gICAgICB0YWJJbmRleD17LTF9XG4gICAgICBvbkNsaWNrPXt0b2dnbGVTaWRlYmFyfVxuICAgICAgdGl0bGU9XCJUb2dnbGUgU2lkZWJhclwiXG4gICAgICBjbGFzc05hbWU9e2NuKFxuICAgICAgICBcImFic29sdXRlIGluc2V0LXktMCB6LTIwIGhpZGRlbiB3LTQgLXRyYW5zbGF0ZS14LTEvMiB0cmFuc2l0aW9uLWFsbCBlYXNlLWxpbmVhciBhZnRlcjphYnNvbHV0ZSBhZnRlcjppbnNldC15LTAgYWZ0ZXI6bGVmdC0xLzIgYWZ0ZXI6dy1bMnB4XSBob3ZlcjphZnRlcjpiZy1zaWRlYmFyLWJvcmRlciBncm91cC1kYXRhLVtzaWRlPWxlZnRdOi1yaWdodC00IGdyb3VwLWRhdGEtW3NpZGU9cmlnaHRdOmxlZnQtMCBzbTpmbGV4XCIsXG4gICAgICAgIFwiW1tkYXRhLXNpZGU9bGVmdF1fJl06Y3Vyc29yLXctcmVzaXplIFtbZGF0YS1zaWRlPXJpZ2h0XV8mXTpjdXJzb3ItZS1yZXNpemVcIixcbiAgICAgICAgXCJbW2RhdGEtc2lkZT1sZWZ0XVtkYXRhLXN0YXRlPWNvbGxhcHNlZF1fJl06Y3Vyc29yLWUtcmVzaXplIFtbZGF0YS1zaWRlPXJpZ2h0XVtkYXRhLXN0YXRlPWNvbGxhcHNlZF1fJl06Y3Vyc29yLXctcmVzaXplXCIsXG4gICAgICAgIFwiZ3JvdXAtZGF0YS1bY29sbGFwc2libGU9b2ZmY2FudmFzXTp0cmFuc2xhdGUteC0wIGdyb3VwLWRhdGEtW2NvbGxhcHNpYmxlPW9mZmNhbnZhc106YWZ0ZXI6bGVmdC1mdWxsIGdyb3VwLWRhdGEtW2NvbGxhcHNpYmxlPW9mZmNhbnZhc106aG92ZXI6Ymctc2lkZWJhclwiLFxuICAgICAgICBcIltbZGF0YS1zaWRlPWxlZnRdW2RhdGEtY29sbGFwc2libGU9b2ZmY2FudmFzXV8mXTotcmlnaHQtMlwiLFxuICAgICAgICBcIltbZGF0YS1zaWRlPXJpZ2h0XVtkYXRhLWNvbGxhcHNpYmxlPW9mZmNhbnZhc11fJl06LWxlZnQtMlwiLFxuICAgICAgICBjbGFzc05hbWVcbiAgICAgICl9XG4gICAgICB7Li4ucHJvcHN9XG4gICAgLz5cbiAgKVxufSlcblNpZGViYXJSYWlsLmRpc3BsYXlOYW1lID0gXCJTaWRlYmFyUmFpbFwiXG5cbmNvbnN0IFNpZGViYXJJbnNldCA9IFJlYWN0LmZvcndhcmRSZWY8XG4gIEhUTUxEaXZFbGVtZW50LFxuICBSZWFjdC5Db21wb25lbnRQcm9wczxcIm1haW5cIj5cbj4oKHsgY2xhc3NOYW1lLCAuLi5wcm9wcyB9LCByZWYpID0+IHtcbiAgcmV0dXJuIChcbiAgICA8bWFpblxuICAgICAgcmVmPXtyZWZ9XG4gICAgICBjbGFzc05hbWU9e2NuKFxuICAgICAgICBcInJlbGF0aXZlIGZsZXggbWluLWgtc3ZoIGZsZXgtMSBmbGV4LWNvbCBiZy1iYWNrZ3JvdW5kXCIsXG4gICAgICAgIFwicGVlci1kYXRhLVt2YXJpYW50PWluc2V0XTptaW4taC1bY2FsYygxMDBzdmgtdGhlbWUoc3BhY2luZy40KSldIG1kOnBlZXItZGF0YS1bdmFyaWFudD1pbnNldF06bS0yIG1kOnBlZXItZGF0YS1bc3RhdGU9Y29sbGFwc2VkXTpwZWVyLWRhdGEtW3ZhcmlhbnQ9aW5zZXRdOm1sLTIgbWQ6cGVlci1kYXRhLVt2YXJpYW50PWluc2V0XTptbC0wIG1kOnBlZXItZGF0YS1bdmFyaWFudD1pbnNldF06cm91bmRlZC14bCBtZDpwZWVyLWRhdGEtW3ZhcmlhbnQ9aW5zZXRdOnNoYWRvd1wiLFxuICAgICAgICBjbGFzc05hbWVcbiAgICAgICl9XG4gICAgICB7Li4ucHJvcHN9XG4gICAgLz5cbiAgKVxufSlcblNpZGViYXJJbnNldC5kaXNwbGF5TmFtZSA9IFwiU2lkZWJhckluc2V0XCJcblxuY29uc3QgU2lkZWJhcklucHV0ID0gUmVhY3QuZm9yd2FyZFJlZjxcbiAgUmVhY3QuRWxlbWVudFJlZjx0eXBlb2YgSW5wdXQ+LFxuICBSZWFjdC5Db21wb25lbnRQcm9wczx0eXBlb2YgSW5wdXQ+XG4+KCh7IGNsYXNzTmFtZSwgLi4ucHJvcHMgfSwgcmVmKSA9PiB7XG4gIHJldHVybiAoXG4gICAgPElucHV0XG4gICAgICByZWY9e3JlZn1cbiAgICAgIGRhdGEtc2lkZWJhcj1cImlucHV0XCJcbiAgICAgIGNsYXNzTmFtZT17Y24oXG4gICAgICAgIFwiaC04IHctZnVsbCBiZy1iYWNrZ3JvdW5kIHNoYWRvdy1ub25lIGZvY3VzLXZpc2libGU6cmluZy0yIGZvY3VzLXZpc2libGU6cmluZy1zaWRlYmFyLXJpbmdcIixcbiAgICAgICAgY2xhc3NOYW1lXG4gICAgICApfVxuICAgICAgey4uLnByb3BzfVxuICAgIC8+XG4gIClcbn0pXG5TaWRlYmFySW5wdXQuZGlzcGxheU5hbWUgPSBcIlNpZGViYXJJbnB1dFwiXG5cbmNvbnN0IFNpZGViYXJIZWFkZXIgPSBSZWFjdC5mb3J3YXJkUmVmPFxuICBIVE1MRGl2RWxlbWVudCxcbiAgUmVhY3QuQ29tcG9uZW50UHJvcHM8XCJkaXZcIj5cbj4oKHsgY2xhc3NOYW1lLCAuLi5wcm9wcyB9LCByZWYpID0+IHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICByZWY9e3JlZn1cbiAgICAgIGRhdGEtc2lkZWJhcj1cImhlYWRlclwiXG4gICAgICBjbGFzc05hbWU9e2NuKFwiZmxleCBmbGV4LWNvbCBnYXAtMiBwLTJcIiwgY2xhc3NOYW1lKX1cbiAgICAgIHsuLi5wcm9wc31cbiAgICAvPlxuICApXG59KVxuU2lkZWJhckhlYWRlci5kaXNwbGF5TmFtZSA9IFwiU2lkZWJhckhlYWRlclwiXG5cbmNvbnN0IFNpZGViYXJGb290ZXIgPSBSZWFjdC5mb3J3YXJkUmVmPFxuICBIVE1MRGl2RWxlbWVudCxcbiAgUmVhY3QuQ29tcG9uZW50UHJvcHM8XCJkaXZcIj5cbj4oKHsgY2xhc3NOYW1lLCAuLi5wcm9wcyB9LCByZWYpID0+IHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICByZWY9e3JlZn1cbiAgICAgIGRhdGEtc2lkZWJhcj1cImZvb3RlclwiXG4gICAgICBjbGFzc05hbWU9e2NuKFwiZmxleCBmbGV4LWNvbCBnYXAtMiBwLTJcIiwgY2xhc3NOYW1lKX1cbiAgICAgIHsuLi5wcm9wc31cbiAgICAvPlxuICApXG59KVxuU2lkZWJhckZvb3Rlci5kaXNwbGF5TmFtZSA9IFwiU2lkZWJhckZvb3RlclwiXG5cbmNvbnN0IFNpZGViYXJTZXBhcmF0b3IgPSBSZWFjdC5mb3J3YXJkUmVmPFxuICBSZWFjdC5FbGVtZW50UmVmPHR5cGVvZiBTZXBhcmF0b3I+LFxuICBSZWFjdC5Db21wb25lbnRQcm9wczx0eXBlb2YgU2VwYXJhdG9yPlxuPigoeyBjbGFzc05hbWUsIC4uLnByb3BzIH0sIHJlZikgPT4ge1xuICByZXR1cm4gKFxuICAgIDxTZXBhcmF0b3JcbiAgICAgIHJlZj17cmVmfVxuICAgICAgZGF0YS1zaWRlYmFyPVwic2VwYXJhdG9yXCJcbiAgICAgIGNsYXNzTmFtZT17Y24oXCJteC0yIHctYXV0byBiZy1zaWRlYmFyLWJvcmRlclwiLCBjbGFzc05hbWUpfVxuICAgICAgey4uLnByb3BzfVxuICAgIC8+XG4gIClcbn0pXG5TaWRlYmFyU2VwYXJhdG9yLmRpc3BsYXlOYW1lID0gXCJTaWRlYmFyU2VwYXJhdG9yXCJcblxuY29uc3QgU2lkZWJhckNvbnRlbnQgPSBSZWFjdC5mb3J3YXJkUmVmPFxuICBIVE1MRGl2RWxlbWVudCxcbiAgUmVhY3QuQ29tcG9uZW50UHJvcHM8XCJkaXZcIj5cbj4oKHsgY2xhc3NOYW1lLCAuLi5wcm9wcyB9LCByZWYpID0+IHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICByZWY9e3JlZn1cbiAgICAgIGRhdGEtc2lkZWJhcj1cImNvbnRlbnRcIlxuICAgICAgY2xhc3NOYW1lPXtjbihcbiAgICAgICAgXCJmbGV4IG1pbi1oLTAgZmxleC0xIGZsZXgtY29sIGdhcC0yIG92ZXJmbG93LWF1dG8gZ3JvdXAtZGF0YS1bY29sbGFwc2libGU9aWNvbl06b3ZlcmZsb3ctaGlkZGVuXCIsXG4gICAgICAgIGNsYXNzTmFtZVxuICAgICAgKX1cbiAgICAgIHsuLi5wcm9wc31cbiAgICAvPlxuICApXG59KVxuU2lkZWJhckNvbnRlbnQuZGlzcGxheU5hbWUgPSBcIlNpZGViYXJDb250ZW50XCJcblxuY29uc3QgU2lkZWJhckdyb3VwID0gUmVhY3QuZm9yd2FyZFJlZjxcbiAgSFRNTERpdkVsZW1lbnQsXG4gIFJlYWN0LkNvbXBvbmVudFByb3BzPFwiZGl2XCI+XG4+KCh7IGNsYXNzTmFtZSwgLi4ucHJvcHMgfSwgcmVmKSA9PiB7XG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgcmVmPXtyZWZ9XG4gICAgICBkYXRhLXNpZGViYXI9XCJncm91cFwiXG4gICAgICBjbGFzc05hbWU9e2NuKFwicmVsYXRpdmUgZmxleCB3LWZ1bGwgbWluLXctMCBmbGV4LWNvbCBwLTJcIiwgY2xhc3NOYW1lKX1cbiAgICAgIHsuLi5wcm9wc31cbiAgICAvPlxuICApXG59KVxuU2lkZWJhckdyb3VwLmRpc3BsYXlOYW1lID0gXCJTaWRlYmFyR3JvdXBcIlxuXG5jb25zdCBTaWRlYmFyR3JvdXBMYWJlbCA9IFJlYWN0LmZvcndhcmRSZWY8XG4gIEhUTUxEaXZFbGVtZW50LFxuICBSZWFjdC5Db21wb25lbnRQcm9wczxcImRpdlwiPiAmIHsgYXNDaGlsZD86IGJvb2xlYW4gfVxuPigoeyBjbGFzc05hbWUsIGFzQ2hpbGQgPSBmYWxzZSwgLi4ucHJvcHMgfSwgcmVmKSA9PiB7XG4gIGNvbnN0IENvbXAgPSBhc0NoaWxkID8gU2xvdCA6IFwiZGl2XCJcblxuICByZXR1cm4gKFxuICAgIDxDb21wXG4gICAgICByZWY9e3JlZn1cbiAgICAgIGRhdGEtc2lkZWJhcj1cImdyb3VwLWxhYmVsXCJcbiAgICAgIGNsYXNzTmFtZT17Y24oXG4gICAgICAgIFwiZHVyYXRpb24tMjAwIGZsZXggaC04IHNocmluay0wIGl0ZW1zLWNlbnRlciByb3VuZGVkLW1kIHB4LTIgdGV4dC14cyBmb250LW1lZGl1bSB0ZXh0LXNpZGViYXItZm9yZWdyb3VuZC83MCBvdXRsaW5lLW5vbmUgcmluZy1zaWRlYmFyLXJpbmcgdHJhbnNpdGlvbi1bbWFyZ2luLG9wYV0gZWFzZS1saW5lYXIgZm9jdXMtdmlzaWJsZTpyaW5nLTIgWyY+c3ZnXTpzaXplLTQgWyY+c3ZnXTpzaHJpbmstMFwiLFxuICAgICAgICBcImdyb3VwLWRhdGEtW2NvbGxhcHNpYmxlPWljb25dOi1tdC04IGdyb3VwLWRhdGEtW2NvbGxhcHNpYmxlPWljb25dOm9wYWNpdHktMFwiLFxuICAgICAgICBjbGFzc05hbWVcbiAgICAgICl9XG4gICAgICB7Li4ucHJvcHN9XG4gICAgLz5cbiAgKVxufSlcblNpZGViYXJHcm91cExhYmVsLmRpc3BsYXlOYW1lID0gXCJTaWRlYmFyR3JvdXBMYWJlbFwiXG5cbmNvbnN0IFNpZGViYXJHcm91cEFjdGlvbiA9IFJlYWN0LmZvcndhcmRSZWY8XG4gIEhUTUxCdXR0b25FbGVtZW50LFxuICBSZWFjdC5Db21wb25lbnRQcm9wczxcImJ1dHRvblwiPiAmIHsgYXNDaGlsZD86IGJvb2xlYW4gfVxuPigoeyBjbGFzc05hbWUsIGFzQ2hpbGQgPSBmYWxzZSwgLi4ucHJvcHMgfSwgcmVmKSA9PiB7XG4gIGNvbnN0IENvbXAgPSBhc0NoaWxkID8gU2xvdCA6IFwiYnV0dG9uXCJcblxuICByZXR1cm4gKFxuICAgIDxDb21wXG4gICAgICByZWY9e3JlZn1cbiAgICAgIGRhdGEtc2lkZWJhcj1cImdyb3VwLWFjdGlvblwiXG4gICAgICBjbGFzc05hbWU9e2NuKFxuICAgICAgICBcImFic29sdXRlIHJpZ2h0LTMgdG9wLTMuNSBmbGV4IGFzcGVjdC1zcXVhcmUgdy01IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciByb3VuZGVkLW1kIHAtMCB0ZXh0LXNpZGViYXItZm9yZWdyb3VuZCBvdXRsaW5lLW5vbmUgcmluZy1zaWRlYmFyLXJpbmcgdHJhbnNpdGlvbi10cmFuc2Zvcm0gaG92ZXI6Ymctc2lkZWJhci1hY2NlbnQgaG92ZXI6dGV4dC1zaWRlYmFyLWFjY2VudC1mb3JlZ3JvdW5kIGZvY3VzLXZpc2libGU6cmluZy0yIFsmPnN2Z106c2l6ZS00IFsmPnN2Z106c2hyaW5rLTBcIixcbiAgICAgICAgLy8gSW5jcmVhc2VzIHRoZSBoaXQgYXJlYSBvZiB0aGUgYnV0dG9uIG9uIG1vYmlsZS5cbiAgICAgICAgXCJhZnRlcjphYnNvbHV0ZSBhZnRlcjotaW5zZXQtMiBhZnRlcjptZDpoaWRkZW5cIixcbiAgICAgICAgXCJncm91cC1kYXRhLVtjb2xsYXBzaWJsZT1pY29uXTpoaWRkZW5cIixcbiAgICAgICAgY2xhc3NOYW1lXG4gICAgICApfVxuICAgICAgey4uLnByb3BzfVxuICAgIC8+XG4gIClcbn0pXG5TaWRlYmFyR3JvdXBBY3Rpb24uZGlzcGxheU5hbWUgPSBcIlNpZGViYXJHcm91cEFjdGlvblwiXG5cbmNvbnN0IFNpZGViYXJHcm91cENvbnRlbnQgPSBSZWFjdC5mb3J3YXJkUmVmPFxuICBIVE1MRGl2RWxlbWVudCxcbiAgUmVhY3QuQ29tcG9uZW50UHJvcHM8XCJkaXZcIj5cbj4oKHsgY2xhc3NOYW1lLCAuLi5wcm9wcyB9LCByZWYpID0+IChcbiAgPGRpdlxuICAgIHJlZj17cmVmfVxuICAgIGRhdGEtc2lkZWJhcj1cImdyb3VwLWNvbnRlbnRcIlxuICAgIGNsYXNzTmFtZT17Y24oXCJ3LWZ1bGwgdGV4dC1zbVwiLCBjbGFzc05hbWUpfVxuICAgIHsuLi5wcm9wc31cbiAgLz5cbikpXG5TaWRlYmFyR3JvdXBDb250ZW50LmRpc3BsYXlOYW1lID0gXCJTaWRlYmFyR3JvdXBDb250ZW50XCJcblxuY29uc3QgU2lkZWJhck1lbnUgPSBSZWFjdC5mb3J3YXJkUmVmPFxuICBIVE1MVUxpc3RFbGVtZW50LFxuICBSZWFjdC5Db21wb25lbnRQcm9wczxcInVsXCI+XG4+KCh7IGNsYXNzTmFtZSwgLi4ucHJvcHMgfSwgcmVmKSA9PiAoXG4gIDx1bFxuICAgIHJlZj17cmVmfVxuICAgIGRhdGEtc2lkZWJhcj1cIm1lbnVcIlxuICAgIGNsYXNzTmFtZT17Y24oXCJmbGV4IHctZnVsbCBtaW4tdy0wIGZsZXgtY29sIGdhcC0xXCIsIGNsYXNzTmFtZSl9XG4gICAgey4uLnByb3BzfVxuICAvPlxuKSlcblNpZGViYXJNZW51LmRpc3BsYXlOYW1lID0gXCJTaWRlYmFyTWVudVwiXG5cbmNvbnN0IFNpZGViYXJNZW51SXRlbSA9IFJlYWN0LmZvcndhcmRSZWY8XG4gIEhUTUxMSUVsZW1lbnQsXG4gIFJlYWN0LkNvbXBvbmVudFByb3BzPFwibGlcIj5cbj4oKHsgY2xhc3NOYW1lLCAuLi5wcm9wcyB9LCByZWYpID0+IChcbiAgPGxpXG4gICAgcmVmPXtyZWZ9XG4gICAgZGF0YS1zaWRlYmFyPVwibWVudS1pdGVtXCJcbiAgICBjbGFzc05hbWU9e2NuKFwiZ3JvdXAvbWVudS1pdGVtIHJlbGF0aXZlXCIsIGNsYXNzTmFtZSl9XG4gICAgey4uLnByb3BzfVxuICAvPlxuKSlcblNpZGViYXJNZW51SXRlbS5kaXNwbGF5TmFtZSA9IFwiU2lkZWJhck1lbnVJdGVtXCJcblxuY29uc3Qgc2lkZWJhck1lbnVCdXR0b25WYXJpYW50cyA9IGN2YShcbiAgXCJwZWVyL21lbnUtYnV0dG9uIGZsZXggdy1mdWxsIGl0ZW1zLWNlbnRlciBnYXAtMiBvdmVyZmxvdy1oaWRkZW4gcm91bmRlZC1tZCBwLTIgdGV4dC1sZWZ0IHRleHQtc20gb3V0bGluZS1ub25lIHJpbmctc2lkZWJhci1yaW5nIHRyYW5zaXRpb24tW3dpZHRoLGhlaWdodCxwYWRkaW5nXSBob3ZlcjpiZy1zaWRlYmFyLWFjY2VudCBob3Zlcjp0ZXh0LXNpZGViYXItYWNjZW50LWZvcmVncm91bmQgZm9jdXMtdmlzaWJsZTpyaW5nLTIgYWN0aXZlOmJnLXNpZGViYXItYWNjZW50IGFjdGl2ZTp0ZXh0LXNpZGViYXItYWNjZW50LWZvcmVncm91bmQgZGlzYWJsZWQ6cG9pbnRlci1ldmVudHMtbm9uZSBkaXNhYmxlZDpvcGFjaXR5LTUwIGdyb3VwLWhhcy1bW2RhdGEtc2lkZWJhcj1tZW51LWFjdGlvbl1dL21lbnUtaXRlbTpwci04IGFyaWEtZGlzYWJsZWQ6cG9pbnRlci1ldmVudHMtbm9uZSBhcmlhLWRpc2FibGVkOm9wYWNpdHktNTAgZGF0YS1bYWN0aXZlPXRydWVdOmJnLXNpZGViYXItYWNjZW50IGRhdGEtW2FjdGl2ZT10cnVlXTpmb250LW1lZGl1bSBkYXRhLVthY3RpdmU9dHJ1ZV06dGV4dC1zaWRlYmFyLWFjY2VudC1mb3JlZ3JvdW5kIGRhdGEtW3N0YXRlPW9wZW5dOmhvdmVyOmJnLXNpZGViYXItYWNjZW50IGRhdGEtW3N0YXRlPW9wZW5dOmhvdmVyOnRleHQtc2lkZWJhci1hY2NlbnQtZm9yZWdyb3VuZCBncm91cC1kYXRhLVtjb2xsYXBzaWJsZT1pY29uXTohc2l6ZS04IGdyb3VwLWRhdGEtW2NvbGxhcHNpYmxlPWljb25dOiFwLTIgWyY+c3BhbjpsYXN0LWNoaWxkXTp0cnVuY2F0ZSBbJj5zdmddOnNpemUtNCBbJj5zdmddOnNocmluay0wXCIsXG4gIHtcbiAgICB2YXJpYW50czoge1xuICAgICAgdmFyaWFudDoge1xuICAgICAgICBkZWZhdWx0OiBcImhvdmVyOmJnLXNpZGViYXItYWNjZW50IGhvdmVyOnRleHQtc2lkZWJhci1hY2NlbnQtZm9yZWdyb3VuZFwiLFxuICAgICAgICBvdXRsaW5lOlxuICAgICAgICAgIFwiYmctYmFja2dyb3VuZCBzaGFkb3ctWzBfMF8wXzFweF9oc2wodmFyKC0tc2lkZWJhci1ib3JkZXIpKV0gaG92ZXI6Ymctc2lkZWJhci1hY2NlbnQgaG92ZXI6dGV4dC1zaWRlYmFyLWFjY2VudC1mb3JlZ3JvdW5kIGhvdmVyOnNoYWRvdy1bMF8wXzBfMXB4X2hzbCh2YXIoLS1zaWRlYmFyLWFjY2VudCkpXVwiLFxuICAgICAgfSxcbiAgICAgIHNpemU6IHtcbiAgICAgICAgZGVmYXVsdDogXCJoLTggdGV4dC1zbVwiLFxuICAgICAgICBzbTogXCJoLTcgdGV4dC14c1wiLFxuICAgICAgICBsZzogXCJoLTEyIHRleHQtc20gZ3JvdXAtZGF0YS1bY29sbGFwc2libGU9aWNvbl06IXAtMFwiLFxuICAgICAgfSxcbiAgICB9LFxuICAgIGRlZmF1bHRWYXJpYW50czoge1xuICAgICAgdmFyaWFudDogXCJkZWZhdWx0XCIsXG4gICAgICBzaXplOiBcImRlZmF1bHRcIixcbiAgICB9LFxuICB9XG4pXG5cbmNvbnN0IFNpZGViYXJNZW51QnV0dG9uID0gUmVhY3QuZm9yd2FyZFJlZjxcbiAgSFRNTEJ1dHRvbkVsZW1lbnQsXG4gIFJlYWN0LkNvbXBvbmVudFByb3BzPFwiYnV0dG9uXCI+ICYge1xuICAgIGFzQ2hpbGQ/OiBib29sZWFuXG4gICAgaXNBY3RpdmU/OiBib29sZWFuXG4gICAgdG9vbHRpcD86IHN0cmluZyB8IFJlYWN0LkNvbXBvbmVudFByb3BzPHR5cGVvZiBUb29sdGlwQ29udGVudD5cbiAgfSAmIFZhcmlhbnRQcm9wczx0eXBlb2Ygc2lkZWJhck1lbnVCdXR0b25WYXJpYW50cz5cbj4oXG4gIChcbiAgICB7XG4gICAgICBhc0NoaWxkID0gZmFsc2UsXG4gICAgICBpc0FjdGl2ZSA9IGZhbHNlLFxuICAgICAgdmFyaWFudCA9IFwiZGVmYXVsdFwiLFxuICAgICAgc2l6ZSA9IFwiZGVmYXVsdFwiLFxuICAgICAgdG9vbHRpcCxcbiAgICAgIGNsYXNzTmFtZSxcbiAgICAgIC4uLnByb3BzXG4gICAgfSxcbiAgICByZWZcbiAgKSA9PiB7XG4gICAgY29uc3QgQ29tcCA9IGFzQ2hpbGQgPyBTbG90IDogXCJidXR0b25cIlxuICAgIGNvbnN0IHsgaXNNb2JpbGUsIHN0YXRlIH0gPSB1c2VTaWRlYmFyKClcblxuICAgIGNvbnN0IGJ1dHRvbiA9IChcbiAgICAgIDxDb21wXG4gICAgICAgIHJlZj17cmVmfVxuICAgICAgICBkYXRhLXNpZGViYXI9XCJtZW51LWJ1dHRvblwiXG4gICAgICAgIGRhdGEtc2l6ZT17c2l6ZX1cbiAgICAgICAgZGF0YS1hY3RpdmU9e2lzQWN0aXZlfVxuICAgICAgICBjbGFzc05hbWU9e2NuKHNpZGViYXJNZW51QnV0dG9uVmFyaWFudHMoeyB2YXJpYW50LCBzaXplIH0pLCBjbGFzc05hbWUpfVxuICAgICAgICB7Li4ucHJvcHN9XG4gICAgICAvPlxuICAgIClcblxuICAgIGlmICghdG9vbHRpcCkge1xuICAgICAgcmV0dXJuIGJ1dHRvblxuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdG9vbHRpcCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgdG9vbHRpcCA9IHtcbiAgICAgICAgY2hpbGRyZW46IHRvb2x0aXAsXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxUb29sdGlwPlxuICAgICAgICA8VG9vbHRpcFRyaWdnZXIgYXNDaGlsZD57YnV0dG9ufTwvVG9vbHRpcFRyaWdnZXI+XG4gICAgICAgIDxUb29sdGlwQ29udGVudFxuICAgICAgICAgIHNpZGU9XCJyaWdodFwiXG4gICAgICAgICAgYWxpZ249XCJjZW50ZXJcIlxuICAgICAgICAgIGhpZGRlbj17c3RhdGUgIT09IFwiY29sbGFwc2VkXCIgfHwgaXNNb2JpbGV9XG4gICAgICAgICAgey4uLnRvb2x0aXB9XG4gICAgICAgIC8+XG4gICAgICA8L1Rvb2x0aXA+XG4gICAgKVxuICB9XG4pXG5TaWRlYmFyTWVudUJ1dHRvbi5kaXNwbGF5TmFtZSA9IFwiU2lkZWJhck1lbnVCdXR0b25cIlxuXG5jb25zdCBTaWRlYmFyTWVudUFjdGlvbiA9IFJlYWN0LmZvcndhcmRSZWY8XG4gIEhUTUxCdXR0b25FbGVtZW50LFxuICBSZWFjdC5Db21wb25lbnRQcm9wczxcImJ1dHRvblwiPiAmIHtcbiAgICBhc0NoaWxkPzogYm9vbGVhblxuICAgIHNob3dPbkhvdmVyPzogYm9vbGVhblxuICB9XG4+KCh7IGNsYXNzTmFtZSwgYXNDaGlsZCA9IGZhbHNlLCBzaG93T25Ib3ZlciA9IGZhbHNlLCAuLi5wcm9wcyB9LCByZWYpID0+IHtcbiAgY29uc3QgQ29tcCA9IGFzQ2hpbGQgPyBTbG90IDogXCJidXR0b25cIlxuXG4gIHJldHVybiAoXG4gICAgPENvbXBcbiAgICAgIHJlZj17cmVmfVxuICAgICAgZGF0YS1zaWRlYmFyPVwibWVudS1hY3Rpb25cIlxuICAgICAgY2xhc3NOYW1lPXtjbihcbiAgICAgICAgXCJhYnNvbHV0ZSByaWdodC0xIHRvcC0xLjUgZmxleCBhc3BlY3Qtc3F1YXJlIHctNSBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgcm91bmRlZC1tZCBwLTAgdGV4dC1zaWRlYmFyLWZvcmVncm91bmQgb3V0bGluZS1ub25lIHJpbmctc2lkZWJhci1yaW5nIHRyYW5zaXRpb24tdHJhbnNmb3JtIGhvdmVyOmJnLXNpZGViYXItYWNjZW50IGhvdmVyOnRleHQtc2lkZWJhci1hY2NlbnQtZm9yZWdyb3VuZCBmb2N1cy12aXNpYmxlOnJpbmctMiBwZWVyLWhvdmVyL21lbnUtYnV0dG9uOnRleHQtc2lkZWJhci1hY2NlbnQtZm9yZWdyb3VuZCBbJj5zdmddOnNpemUtNCBbJj5zdmddOnNocmluay0wXCIsXG4gICAgICAgIC8vIEluY3JlYXNlcyB0aGUgaGl0IGFyZWEgb2YgdGhlIGJ1dHRvbiBvbiBtb2JpbGUuXG4gICAgICAgIFwiYWZ0ZXI6YWJzb2x1dGUgYWZ0ZXI6LWluc2V0LTIgYWZ0ZXI6bWQ6aGlkZGVuXCIsXG4gICAgICAgIFwicGVlci1kYXRhLVtzaXplPXNtXS9tZW51LWJ1dHRvbjp0b3AtMVwiLFxuICAgICAgICBcInBlZXItZGF0YS1bc2l6ZT1kZWZhdWx0XS9tZW51LWJ1dHRvbjp0b3AtMS41XCIsXG4gICAgICAgIFwicGVlci1kYXRhLVtzaXplPWxnXS9tZW51LWJ1dHRvbjp0b3AtMi41XCIsXG4gICAgICAgIFwiZ3JvdXAtZGF0YS1bY29sbGFwc2libGU9aWNvbl06aGlkZGVuXCIsXG4gICAgICAgIHNob3dPbkhvdmVyICYmXG4gICAgICAgICAgXCJncm91cC1mb2N1cy13aXRoaW4vbWVudS1pdGVtOm9wYWNpdHktMTAwIGdyb3VwLWhvdmVyL21lbnUtaXRlbTpvcGFjaXR5LTEwMCBkYXRhLVtzdGF0ZT1vcGVuXTpvcGFjaXR5LTEwMCBwZWVyLWRhdGEtW2FjdGl2ZT10cnVlXS9tZW51LWJ1dHRvbjp0ZXh0LXNpZGViYXItYWNjZW50LWZvcmVncm91bmQgbWQ6b3BhY2l0eS0wXCIsXG4gICAgICAgIGNsYXNzTmFtZVxuICAgICAgKX1cbiAgICAgIHsuLi5wcm9wc31cbiAgICAvPlxuICApXG59KVxuU2lkZWJhck1lbnVBY3Rpb24uZGlzcGxheU5hbWUgPSBcIlNpZGViYXJNZW51QWN0aW9uXCJcblxuY29uc3QgU2lkZWJhck1lbnVCYWRnZSA9IFJlYWN0LmZvcndhcmRSZWY8XG4gIEhUTUxEaXZFbGVtZW50LFxuICBSZWFjdC5Db21wb25lbnRQcm9wczxcImRpdlwiPlxuPigoeyBjbGFzc05hbWUsIC4uLnByb3BzIH0sIHJlZikgPT4gKFxuICA8ZGl2XG4gICAgcmVmPXtyZWZ9XG4gICAgZGF0YS1zaWRlYmFyPVwibWVudS1iYWRnZVwiXG4gICAgY2xhc3NOYW1lPXtjbihcbiAgICAgIFwiYWJzb2x1dGUgcmlnaHQtMSBmbGV4IGgtNSBtaW4tdy01IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciByb3VuZGVkLW1kIHB4LTEgdGV4dC14cyBmb250LW1lZGl1bSB0YWJ1bGFyLW51bXMgdGV4dC1zaWRlYmFyLWZvcmVncm91bmQgc2VsZWN0LW5vbmUgcG9pbnRlci1ldmVudHMtbm9uZVwiLFxuICAgICAgXCJwZWVyLWhvdmVyL21lbnUtYnV0dG9uOnRleHQtc2lkZWJhci1hY2NlbnQtZm9yZWdyb3VuZCBwZWVyLWRhdGEtW2FjdGl2ZT10cnVlXS9tZW51LWJ1dHRvbjp0ZXh0LXNpZGViYXItYWNjZW50LWZvcmVncm91bmRcIixcbiAgICAgIFwicGVlci1kYXRhLVtzaXplPXNtXS9tZW51LWJ1dHRvbjp0b3AtMVwiLFxuICAgICAgXCJwZWVyLWRhdGEtW3NpemU9ZGVmYXVsdF0vbWVudS1idXR0b246dG9wLTEuNVwiLFxuICAgICAgXCJwZWVyLWRhdGEtW3NpemU9bGddL21lbnUtYnV0dG9uOnRvcC0yLjVcIixcbiAgICAgIFwiZ3JvdXAtZGF0YS1bY29sbGFwc2libGU9aWNvbl06aGlkZGVuXCIsXG4gICAgICBjbGFzc05hbWVcbiAgICApfVxuICAgIHsuLi5wcm9wc31cbiAgLz5cbikpXG5TaWRlYmFyTWVudUJhZGdlLmRpc3BsYXlOYW1lID0gXCJTaWRlYmFyTWVudUJhZGdlXCJcblxuY29uc3QgU2lkZWJhck1lbnVTa2VsZXRvbiA9IFJlYWN0LmZvcndhcmRSZWY8XG4gIEhUTUxEaXZFbGVtZW50LFxuICBSZWFjdC5Db21wb25lbnRQcm9wczxcImRpdlwiPiAmIHtcbiAgICBzaG93SWNvbj86IGJvb2xlYW5cbiAgfVxuPigoeyBjbGFzc05hbWUsIHNob3dJY29uID0gZmFsc2UsIC4uLnByb3BzIH0sIHJlZikgPT4ge1xuICAvLyBSYW5kb20gd2lkdGggYmV0d2VlbiA1MCB0byA5MCUuXG4gIGNvbnN0IHdpZHRoID0gUmVhY3QudXNlTWVtbygoKSA9PiB7XG4gICAgcmV0dXJuIGAke01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDQwKSArIDUwfSVgXG4gIH0sIFtdKVxuXG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgcmVmPXtyZWZ9XG4gICAgICBkYXRhLXNpZGViYXI9XCJtZW51LXNrZWxldG9uXCJcbiAgICAgIGNsYXNzTmFtZT17Y24oXCJyb3VuZGVkLW1kIGgtOCBmbGV4IGdhcC0yIHB4LTIgaXRlbXMtY2VudGVyXCIsIGNsYXNzTmFtZSl9XG4gICAgICB7Li4ucHJvcHN9XG4gICAgPlxuICAgICAge3Nob3dJY29uICYmIChcbiAgICAgICAgPFNrZWxldG9uXG4gICAgICAgICAgY2xhc3NOYW1lPVwic2l6ZS00IHJvdW5kZWQtbWRcIlxuICAgICAgICAgIGRhdGEtc2lkZWJhcj1cIm1lbnUtc2tlbGV0b24taWNvblwiXG4gICAgICAgIC8+XG4gICAgICApfVxuICAgICAgPFNrZWxldG9uXG4gICAgICAgIGNsYXNzTmFtZT1cImgtNCBmbGV4LTEgbWF4LXctWy0tc2tlbGV0b24td2lkdGhdXCJcbiAgICAgICAgZGF0YS1zaWRlYmFyPVwibWVudS1za2VsZXRvbi10ZXh0XCJcbiAgICAgICAgc3R5bGU9e1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwiLS1za2VsZXRvbi13aWR0aFwiOiB3aWR0aCxcbiAgICAgICAgICB9IGFzIFJlYWN0LkNTU1Byb3BlcnRpZXNcbiAgICAgICAgfVxuICAgICAgLz5cbiAgICA8L2Rpdj5cbiAgKVxufSlcblNpZGViYXJNZW51U2tlbGV0b24uZGlzcGxheU5hbWUgPSBcIlNpZGViYXJNZW51U2tlbGV0b25cIlxuXG5jb25zdCBTaWRlYmFyTWVudVN1YiA9IFJlYWN0LmZvcndhcmRSZWY8XG4gIEhUTUxVTGlzdEVsZW1lbnQsXG4gIFJlYWN0LkNvbXBvbmVudFByb3BzPFwidWxcIj5cbj4oKHsgY2xhc3NOYW1lLCAuLi5wcm9wcyB9LCByZWYpID0+IChcbiAgPHVsXG4gICAgcmVmPXtyZWZ9XG4gICAgZGF0YS1zaWRlYmFyPVwibWVudS1zdWJcIlxuICAgIGNsYXNzTmFtZT17Y24oXG4gICAgICBcIm14LTMuNSBmbGV4IG1pbi13LTAgdHJhbnNsYXRlLXgtcHggZmxleC1jb2wgZ2FwLTEgYm9yZGVyLWwgYm9yZGVyLXNpZGViYXItYm9yZGVyIHB4LTIuNSBweS0wLjVcIixcbiAgICAgIFwiZ3JvdXAtZGF0YS1bY29sbGFwc2libGU9aWNvbl06aGlkZGVuXCIsXG4gICAgICBjbGFzc05hbWVcbiAgICApfVxuICAgIHsuLi5wcm9wc31cbiAgLz5cbikpXG5TaWRlYmFyTWVudVN1Yi5kaXNwbGF5TmFtZSA9IFwiU2lkZWJhck1lbnVTdWJcIlxuXG5jb25zdCBTaWRlYmFyTWVudVN1Ykl0ZW0gPSBSZWFjdC5mb3J3YXJkUmVmPFxuICBIVE1MTElFbGVtZW50LFxuICBSZWFjdC5Db21wb25lbnRQcm9wczxcImxpXCI+XG4+KCh7IC4uLnByb3BzIH0sIHJlZikgPT4gPGxpIHJlZj17cmVmfSB7Li4ucHJvcHN9IC8+KVxuU2lkZWJhck1lbnVTdWJJdGVtLmRpc3BsYXlOYW1lID0gXCJTaWRlYmFyTWVudVN1Ykl0ZW1cIlxuXG5jb25zdCBTaWRlYmFyTWVudVN1YkJ1dHRvbiA9IFJlYWN0LmZvcndhcmRSZWY8XG4gIEhUTUxBbmNob3JFbGVtZW50LFxuICBSZWFjdC5Db21wb25lbnRQcm9wczxcImFcIj4gJiB7XG4gICAgYXNDaGlsZD86IGJvb2xlYW5cbiAgICBzaXplPzogXCJzbVwiIHwgXCJtZFwiXG4gICAgaXNBY3RpdmU/OiBib29sZWFuXG4gIH1cbj4oKHsgYXNDaGlsZCA9IGZhbHNlLCBzaXplID0gXCJtZFwiLCBpc0FjdGl2ZSwgY2xhc3NOYW1lLCAuLi5wcm9wcyB9LCByZWYpID0+IHtcbiAgY29uc3QgQ29tcCA9IGFzQ2hpbGQgPyBTbG90IDogXCJhXCJcblxuICByZXR1cm4gKFxuICAgIDxDb21wXG4gICAgICByZWY9e3JlZn1cbiAgICAgIGRhdGEtc2lkZWJhcj1cIm1lbnUtc3ViLWJ1dHRvblwiXG4gICAgICBkYXRhLXNpemU9e3NpemV9XG4gICAgICBkYXRhLWFjdGl2ZT17aXNBY3RpdmV9XG4gICAgICBjbGFzc05hbWU9e2NuKFxuICAgICAgICBcImZsZXggaC03IG1pbi13LTAgLXRyYW5zbGF0ZS14LXB4IGl0ZW1zLWNlbnRlciBnYXAtMiBvdmVyZmxvdy1oaWRkZW4gcm91bmRlZC1tZCBweC0yIHRleHQtc2lkZWJhci1mb3JlZ3JvdW5kIG91dGxpbmUtbm9uZSByaW5nLXNpZGViYXItcmluZyBob3ZlcjpiZy1zaWRlYmFyLWFjY2VudCBob3Zlcjp0ZXh0LXNpZGViYXItYWNjZW50LWZvcmVncm91bmQgZm9jdXMtdmlzaWJsZTpyaW5nLTIgYWN0aXZlOmJnLXNpZGViYXItYWNjZW50IGFjdGl2ZTp0ZXh0LXNpZGViYXItYWNjZW50LWZvcmVncm91bmQgZGlzYWJsZWQ6cG9pbnRlci1ldmVudHMtbm9uZSBkaXNhYmxlZDpvcGFjaXR5LTUwIGFyaWEtZGlzYWJsZWQ6cG9pbnRlci1ldmVudHMtbm9uZSBhcmlhLWRpc2FibGVkOm9wYWNpdHktNTAgWyY+c3BhbjpsYXN0LWNoaWxkXTp0cnVuY2F0ZSBbJj5zdmddOnNpemUtNCBbJj5zdmddOnNocmluay0wIFsmPnN2Z106dGV4dC1zaWRlYmFyLWFjY2VudC1mb3JlZ3JvdW5kXCIsXG4gICAgICAgIFwiZGF0YS1bYWN0aXZlPXRydWVdOmJnLXNpZGViYXItYWNjZW50IGRhdGEtW2FjdGl2ZT10cnVlXTp0ZXh0LXNpZGViYXItYWNjZW50LWZvcmVncm91bmRcIixcbiAgICAgICAgc2l6ZSA9PT0gXCJzbVwiICYmIFwidGV4dC14c1wiLFxuICAgICAgICBzaXplID09PSBcIm1kXCIgJiYgXCJ0ZXh0LXNtXCIsXG4gICAgICAgIFwiZ3JvdXAtZGF0YS1bY29sbGFwc2libGU9aWNvbl06aGlkZGVuXCIsXG4gICAgICAgIGNsYXNzTmFtZVxuICAgICAgKX1cbiAgICAgIHsuLi5wcm9wc31cbiAgICAvPlxuICApXG59KVxuU2lkZWJhck1lbnVTdWJCdXR0b24uZGlzcGxheU5hbWUgPSBcIlNpZGViYXJNZW51U3ViQnV0dG9uXCJcblxuZXhwb3J0IHtcbiAgU2lkZWJhcixcbiAgU2lkZWJhckNvbnRlbnQsXG4gIFNpZGViYXJGb290ZXIsXG4gIFNpZGViYXJHcm91cCxcbiAgU2lkZWJhckdyb3VwQWN0aW9uLFxuICBTaWRlYmFyR3JvdXBDb250ZW50LFxuICBTaWRlYmFyR3JvdXBMYWJlbCxcbiAgU2lkZWJhckhlYWRlcixcbiAgU2lkZWJhcklucHV0LFxuICBTaWRlYmFySW5zZXQsXG4gIFNpZGViYXJNZW51LFxuICBTaWRlYmFyTWVudUFjdGlvbixcbiAgU2lkZWJhck1lbnVCYWRnZSxcbiAgU2lkZWJhck1lbnVCdXR0b24sXG4gIFNpZGViYXJNZW51SXRlbSxcbiAgU2lkZWJhck1lbnVTa2VsZXRvbixcbiAgU2lkZWJhck1lbnVTdWIsXG4gIFNpZGViYXJNZW51U3ViQnV0dG9uLFxuICBTaWRlYmFyTWVudVN1Ykl0ZW0sXG4gIFNpZGViYXJQcm92aWRlcixcbiAgU2lkZWJhclJhaWwsXG4gIFNpZGViYXJTZXBhcmF0b3IsXG4gIFNpZGViYXJUcmlnZ2VyLFxuICB1c2VTaWRlYmFyLFxufVxuIl0sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxLQUFLQSxLQUFLLE1BQU0sT0FBTztBQUM5QixTQUFTQyxJQUFJLFFBQVEsc0JBQXNCO0FBQzNDLFNBQXVCQyxHQUFHLFFBQVEsMEJBQTBCO0FBQzVELFNBQVNDLFNBQVMsUUFBUSxjQUFjO0FBRXhDLFNBQVNDLFdBQVcsUUFBUSxvQkFBb0I7QUFDaEQsU0FBU0MsRUFBRSxRQUFRLGFBQWE7QUFDaEMsU0FBU0MsTUFBTSxRQUFRLHdCQUF3QjtBQUMvQyxTQUFTQyxLQUFLLFFBQVEsdUJBQXVCO0FBQzdDLFNBQVNDLFNBQVMsUUFBUSwyQkFBMkI7QUFDckQsU0FBU0MsS0FBSyxFQUFFQyxZQUFZLFFBQVEsdUJBQXVCO0FBQzNELFNBQVNDLFFBQVEsUUFBUSwwQkFBMEI7QUFDbkQsU0FDRUMsT0FBTyxFQUNQQyxjQUFjLEVBQ2RDLGVBQWUsRUFDZkMsY0FBYyxRQUNULHlCQUF5QjtBQUVoQyxNQUFNQyxtQkFBbUIsR0FBRyxlQUFlO0FBQzNDLE1BQU1DLHNCQUFzQixHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7QUFDL0MsTUFBTUMsYUFBYSxHQUFHLE9BQU87QUFDN0IsTUFBTUMsb0JBQW9CLEdBQUcsT0FBTztBQUNwQyxNQUFNQyxrQkFBa0IsR0FBRyxNQUFNO0FBQ2pDLE1BQU1DLHlCQUF5QixHQUFHLEdBQUc7QUFZckMsTUFBTUMsY0FBYyxnQkFBR3RCLEtBQUssQ0FBQ3VCLGFBQWEsQ0FBd0IsSUFBSSxDQUFDO0FBRXZFLFNBQVNDLFVBQVVBLENBQUEsRUFBRztFQUNwQixNQUFNQyxPQUFPLEdBQUd6QixLQUFLLENBQUMwQixVQUFVLENBQUNKLGNBQWMsQ0FBQztFQUNoRCxJQUFJLENBQUNHLE9BQU8sRUFBRTtJQUNaLE1BQU0s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