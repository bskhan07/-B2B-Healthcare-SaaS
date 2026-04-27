# Responsive Design Implementation Walkthrough

The entire project has been updated with a mobile-first, responsive architecture. This ensures a seamless experience across mobile, tablet, and desktop devices.

## 📱 Key Responsiveness Features

### 1. Responsive Sidebar & Navigation
- **Desktop**: The sidebar is fixed and can be collapsed to a mini-view.
- **Mobile/Tablet**: The sidebar is hidden by default and acts as a slide-in overlay (drawer).
- **Hamburger Menu**: A new menu button has been added to the header on mobile to toggle the sidebar.
- **Backdrop**: An interactive backdrop appears when the sidebar is open on mobile to dim the background.

### 2. Adaptive Layout
The main application container (`App.tsx`) now handles layout shifts dynamically:
- **Desktop**: Pushes content to the right based on sidebar width (`pl-[260px]` or `pl-[68px]`).
- **Mobile**: Content occupies the full width of the screen.

### 3. Shared Responsive Components
To ensure future pages are also responsive, new components were added to `@healthcare/ui`:

#### `PageLayout`
Use this component as the root of every new page. It automatically handles:
- Responsive headers (stacking on mobile, side-by-side on desktop).
- Consistency in padding and transitions.
- Quick actions (buttons) consistency.

```tsx
import { PageLayout } from "@healthcare/ui";
import { Plus } from "lucide-react";

export default function NewPage() {
  return (
    <PageLayout
      title="New Feature"
      subtitle="Brief description of this feature"
      actions={
        <button className="bg-primary text-white px-4 py-2 rounded-lg">
          <Plus className="w-4 h-4 mr-2" /> Add Item
        </button>
      }
    >
      {/* Your content here */}
    </PageLayout>
  );
}
```

#### `ResponsiveGrid`
A utility component to quickly build responsive layouts (1 column on mobile, N columns on desktop).

```tsx
import { ResponsiveGrid } from "@healthcare/ui";

<ResponsiveGrid cols={3}>
  <Card />
  <Card />
  <Card />
</ResponsiveGrid>
```

## 🏗️ Technical Updates

| Component | Change Description |
| :--- | :--- |
| **App.tsx** | Added `mobileSidebarOpen` state and responsive main content padding. |
| **TopBar.tsx** | Added mobile hamburger menu, adjusted actions for small screens, and improved breadcrumbs for mobile. |
| **Sidebar.tsx** | Added framer-motion animations for mobile slide-in and a backdrop overlay. |
| **PageLayout.tsx** | New reusable foundation for all current and future pages. |
| **PatientsPage.tsx** | Updated as a reference implementation of the new `PageLayout`. |

## 💡 Best Practices for Future Pages

1.  **Use `PageLayout`**: Always wrap your page content in `<PageLayout>`.
2.  **Relative Widths**: Avoid hardcoded pixel widths (`w-[400px]`). Use percentages (`w-full`), flex-grow, or grid.
3.  **Tailwind Breakpoints**:
    -   `sm:` (640px)
    -   `md:` (768px)
    -   `lg:` (1024px) - *Sidebar shifts to fixed here*
    -   `xl:` (1280px)
4.  **Flexbox & Grid**: Leverage `flex-col sm:flex-row` pattern frequently for headers and lists.
