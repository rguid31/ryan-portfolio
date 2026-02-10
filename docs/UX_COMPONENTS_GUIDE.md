# UX Components Quick Reference Guide

This guide provides quick examples for using the new UX components in your application.

---

## Toast Notifications

### Import
```tsx
import { useToast, ToastContainer } from '@/components/ui';
```

### Usage in Component
```tsx
function MyComponent() {
  const { success, error, warning, info, toasts, removeToast } = useToast();

  const handleSave = async () => {
    try {
      await saveData();
      success('Data saved successfully!');
    } catch (err) {
      error('Failed to save data. Please try again.');
    }
  };

  return (
    <>
      <button onClick={handleSave}>Save</button>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}
```

### Toast Types
- `success(message)` - Green toast with checkmark
- `error(message)` - Red toast with X icon
- `warning(message)` - Yellow toast with warning icon
- `info(message)` - Blue toast with info icon

---

## Profile Completion Widget

### Import
```tsx
import { ProfileCompletion } from '@/components/ui';
```

### Usage
```tsx
<ProfileCompletion
  profile={userProfile}
  onSectionClick={(section) => {
    // Navigate to the clicked section
    setActiveTab(section);
  }}
/>
```

### Features
- Shows completion percentage
- Lists 8 sections with completion status
- Click any section to navigate
- Motivational messages based on progress
- Required fields marked with *

---

## Empty States

### Import
```tsx
import { EmptyState, DashboardEmptyState, SectionEmptyState } from '@/components/ui';
```

### Usage - Generic Empty State
```tsx
<EmptyState
  icon="🎯"
  title="No Items Found"
  description="You haven't added any items yet. Click below to get started."
  action={{
    label: "Add Item",
    onClick: () => handleAdd()
  }}
  secondaryAction={{
    label: "Learn More",
    onClick: () => handleLearnMore()
  }}
/>
```

### Usage - Dashboard Empty State
```tsx
<DashboardEmptyState
  onGetStarted={() => setActiveTab('identity')}
/>
```

### Usage - Section Empty State
```tsx
<SectionEmptyState
  section="experience"  // or 'education', 'skills', 'projects', 'links'
  onAdd={() => addNewEntry()}
/>
```

---

## Publish Preview Modal

### Import
```tsx
import { PublishPreviewModal } from '@/components/ui';
```

### Usage
```tsx
const [showModal, setShowModal] = useState(false);
const [isPublishing, setIsPublishing] = useState(false);

// When user clicks "Publish" button
<button onClick={() => setShowModal(true)}>Publish</button>

// Render modal
<PublishPreviewModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onConfirm={async () => {
    setIsPublishing(true);
    await publishProfile();
    setIsPublishing(false);
    setShowModal(false);
  }}
  profile={draft}
  visibility={visibility}
  isPublishing={isPublishing}
/>
```

### Features
- Shows profile summary
- Displays statistics of what's being published
- Lists all public sections
- PII warning if contact info is public
- Privacy reminders
- Disabled state during publishing

---

## Custom Animations

### Available Classes
```tsx
// Fade in with upward movement (300ms)
<div className="animate-fadeIn">Content</div>

// Slide up from bottom (400ms)
<div className="animate-slideUp">Content</div>

// Subtle pulsing (2s infinite)
<div className="animate-pulse-subtle">Content</div>
```

### Usage Example
```tsx
// Apply animation when content appears
{isVisible && (
  <div className="animate-fadeIn">
    <p>This content fades in smoothly</p>
  </div>
)}
```

---

## Styling Patterns

### Colors

#### Success/Positive
```tsx
className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
```

#### Error/Negative
```tsx
className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
```

#### Warning
```tsx
className="bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800"
```

#### Info
```tsx
className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
```

### Buttons

#### Primary
```tsx
className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
```

#### Secondary
```tsx
className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
```

#### Disabled
```tsx
disabled={isLoading}
className="... disabled:opacity-50 disabled:cursor-not-allowed"
```

### Cards
```tsx
className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6"
```

---

## Accessibility Checklist

When creating new components, ensure:

### Keyboard Navigation
- [ ] All interactive elements keyboard accessible
- [ ] Visible focus states
- [ ] Logical tab order
- [ ] ESC closes modals

### Screen Readers
- [ ] Meaningful ARIA labels
- [ ] ARIA live regions for dynamic content
- [ ] Semantic HTML (button, nav, main, etc.)
- [ ] Alt text on images

### Visual
- [ ] Color contrast ratio > 4.5:1
- [ ] Multiple indicators beyond color
- [ ] Readable at 200% zoom
- [ ] Clear focus indicators

### Motion
- [ ] Respects prefers-reduced-motion
- [ ] Animations enhance, don't block
- [ ] Alternative feedback provided

### Testing
```tsx
// Check for reduced motion preference
@media (prefers-reduced-motion: reduce) {
  .my-animation {
    animation: none;
  }
}
```

---

## Mobile-First Responsive Design

### Breakpoints
- **Mobile:** Default (< 640px)
- **Tablet:** sm: (640px+)
- **Desktop:** md: (768px+)
- **Large Desktop:** lg: (1024px+)

### Example
```tsx
<div className="
  flex flex-col          // Mobile: stack vertically
  sm:flex-row            // Tablet+: horizontal layout
  gap-4                  // Spacing
  p-4 sm:p-6 lg:p-8      // Responsive padding
">
  <button className="
    w-full               // Mobile: full width
    sm:w-auto            // Tablet+: auto width
    px-4 py-3            // Touch-friendly (48px minimum)
    sm:px-6 sm:py-2      // Desktop: smaller
  ">
    Submit
  </button>
</div>
```

### Touch Targets
Minimum 44x44px for touch targets:
```tsx
<button className="min-w-[44px] min-h-[44px] ...">
```

---

## Testing Your UX Improvements

### Manual Testing Checklist

#### Toast Notifications
- [ ] Toasts appear correctly
- [ ] Multiple toasts stack properly
- [ ] Auto-dismiss works after 3s
- [ ] Manual close button works
- [ ] Keyboard accessible (Tab + Enter to close)

#### Profile Completion
- [ ] Percentage calculates correctly
- [ ] All sections listed
- [ ] Click navigation works
- [ ] Completion states update
- [ ] Motivational messages change

#### Publish Preview
- [ ] Statistics display correctly
- [ ] Public sections listed accurately
- [ ] PII warning shows when needed
- [ ] Publish button disabled appropriately
- [ ] Loading state works
- [ ] ESC key closes modal

#### Empty States
- [ ] Show when sections are empty
- [ ] Action buttons work
- [ ] Icons and text appropriate
- [ ] Responsive on mobile

#### Animations
- [ ] Smooth transitions
- [ ] No janky movements
- [ ] Respect prefers-reduced-motion

### Browser Testing
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Accessibility Testing
- [ ] Keyboard navigation works
- [ ] Screen reader announces correctly (NVDA/JAWS)
- [ ] Color contrast passes (WAVE tool)
- [ ] Focus indicators visible
- [ ] Works at 200% zoom

---

## Common Patterns

### Loading States
```tsx
{isLoading ? (
  <div className="flex items-center gap-2">
    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
    <span>Loading...</span>
  </div>
) : (
  <Content />
)}
```

### Conditional Rendering with Animation
```tsx
{isVisible && (
  <div className="animate-fadeIn">
    <Content />
  </div>
)}
```

### Modal Pattern
```tsx
{isOpen && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
    onClick={onClose}
  >
    <div
      className="bg-white dark:bg-gray-900 rounded-xl max-w-2xl w-full"
      onClick={(e) => e.stopPropagation()}
    >
      <ModalContent />
    </div>
  </div>
)}
```

---

## Quick Troubleshooting

### Toasts not appearing?
- Check ToastContainer is rendered
- Verify useToast hook is called
- Check z-index conflicts

### Animations not working?
- Verify globals.css is imported
- Check class name spelling
- Test without prefers-reduced-motion

### Modal not closing?
- Verify onClick on backdrop
- Check stopPropagation on content
- Test ESC key handler

### Dark mode issues?
- Use dark: prefix for dark variants
- Test both light and dark modes
- Check color contrast in both modes

---

## Best Practices

1. **Always provide feedback** for user actions
2. **Use appropriate toast types** (success, error, warning, info)
3. **Show loading states** for async operations
4. **Include empty states** for all data lists
5. **Preview before destructive actions** (delete, publish, etc.)
6. **Make all interactions reversible** when possible
7. **Test on mobile devices** regularly
8. **Verify keyboard accessibility** for all features
9. **Use semantic HTML** for better accessibility
10. **Respect user preferences** (reduced motion, dark mode)

---

## Resources

- [UX Audit Report](./UX_AUDIT.md)
- [UX Improvements Summary](./UX_IMPROVEMENTS_SUMMARY.md)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)

---

**Last Updated:** February 10, 2026
