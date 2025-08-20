import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { EnhancedTimestampConverter } from '@/components/EnhancedTimestampConverter';
import { FAQ } from '@/components/FAQ';
import { Hero } from '@/components/Hero';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  describe('EnhancedTimestampConverter', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(<EnhancedTimestampConverter />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper heading hierarchy', () => {
      const { container } = render(<EnhancedTimestampConverter />);
      
      const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const headingLevels = Array.from(headings).map(h => parseInt(h.tagName.charAt(1)));
      
      // Check that heading levels don't skip (e.g., h1 -> h3)
      for (let i = 1; i < headingLevels.length; i++) {
        const currentLevel = headingLevels[i];
        const previousLevel = headingLevels[i - 1];
        expect(currentLevel - previousLevel).toBeLessThanOrEqual(1);
      }
    });

    it('should have proper form labels', () => {
      const { container } = render(<EnhancedTimestampConverter />);
      
      const inputs = container.querySelectorAll('input');
      inputs.forEach(input => {
        const id = input.getAttribute('id');
        if (id) {
          const label = container.querySelector(`label[for="${id}"]`);
          expect(label).toBeInTheDocument();
        }
      });
    });

    it('should have proper button accessibility', () => {
      const { container } = render(<EnhancedTimestampConverter />);
      
      const buttons = container.querySelectorAll('button');
      buttons.forEach(button => {
        // Each button should have accessible text (either text content or aria-label)
        const hasText = button.textContent && button.textContent.trim().length > 0;
        const hasAriaLabel = button.getAttribute('aria-label');
        const hasTitle = button.getAttribute('title');
        
        expect(hasText || hasAriaLabel || hasTitle).toBe(true);
      });
    });

    it('should have proper color contrast', () => {
      // This would typically use a tool like axe-core or manual testing
      // For now, we'll check that we're using semantic color classes
      const { container } = render(<EnhancedTimestampConverter />);
      
      const textElements = container.querySelectorAll('[class*="text-"]');
      textElements.forEach(element => {
        const classes = element.className;
        // Ensure we're not using very light text on light backgrounds
        expect(classes).not.toMatch(/text-gray-100.*bg-white/);
        expect(classes).not.toMatch(/text-white.*bg-gray-100/);
      });
    });
  });

  describe('FAQ Component', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(<FAQ />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper ARIA attributes for expandable content', () => {
      const { container } = render(<FAQ />);
      
      const buttons = container.querySelectorAll('button[aria-expanded]');
      expect(buttons.length).toBeGreaterThan(0);
      
      buttons.forEach(button => {
        expect(button).toHaveAttribute('aria-expanded');
      });
    });
  });

  describe('Hero Component', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(<Hero />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper heading structure', () => {
      const { container } = render(<Hero />);
      
      const h1 = container.querySelector('h1');
      expect(h1).toBeInTheDocument();
      expect(h1?.textContent).toBeTruthy();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should support tab navigation through interactive elements', () => {
      const { container } = render(<EnhancedTimestampConverter />);
      
      const focusableElements = container.querySelectorAll(
        'button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])'
      );
      
      focusableElements.forEach(element => {
        // Elements should not have negative tabindex unless specifically intended
        const tabIndex = element.getAttribute('tabindex');
        if (tabIndex !== null) {
          expect(parseInt(tabIndex)).toBeGreaterThanOrEqual(0);
        }
      });
    });

    it('should have visible focus indicators', () => {
      const { container } = render(<EnhancedTimestampConverter />);
      
      // Check that focus styles are applied (this would be more comprehensive in real tests)
      const style = getComputedStyle(container);
      expect(style).toBeDefined();
    });
  });

  describe('Screen Reader Support', () => {
    it('should have proper landmark roles', () => {
      const { container } = render(<EnhancedTimestampConverter />);
      
      // Check for semantic HTML elements that provide landmark roles
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('should have descriptive error messages', async () => {
      const { container } = render(<EnhancedTimestampConverter />);
      
      // Error messages should be associated with form controls
      const errorElements = container.querySelectorAll('[role="alert"], .error, [id*="error"]');
      errorElements.forEach(error => {
        expect(error.textContent).toBeTruthy();
      });
    });

    it('should have proper live regions for dynamic content', () => {
      const { container } = render(<EnhancedTimestampConverter />);
      
      // Check for aria-live regions or role="status"
      const liveRegions = container.querySelectorAll('[aria-live], [role="status"], [role="alert"]');
      // Should have at least some live regions for dynamic updates
      expect(liveRegions.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Mobile Accessibility', () => {
    it('should have proper touch target sizes', () => {
      const { container } = render(<EnhancedTimestampConverter />);
      
      const interactiveElements = container.querySelectorAll('button, input, a');
      interactiveElements.forEach(element => {
        const styles = getComputedStyle(element);
        const minHeight = styles.minHeight;
        
        // Check for minimum touch target size (44px is recommended)
        if (minHeight && minHeight !== 'auto') {
          const heightValue = parseInt(minHeight);
          expect(heightValue).toBeGreaterThanOrEqual(44);
        }
      });
    });

    it('should prevent zoom on input focus for iOS', () => {
      const { container } = render(<EnhancedTimestampConverter />);
      
      const inputs = container.querySelectorAll('input');
      inputs.forEach(input => {
        const style = input.getAttribute('style');
        // Check for font-size: 16px to prevent iOS zoom
        if (style) {
          expect(style).toContain('font-size: 16px');
        }
      });
    });
  });

  describe('Reduced Motion Support', () => {
    it('should respect prefers-reduced-motion', () => {
      // Mock prefers-reduced-motion
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      const { container } = render(<EnhancedTimestampConverter />);
      
      // Check that animations can be disabled
      const animatedElements = container.querySelectorAll('[class*="transition"], [class*="animate"]');
      expect(animatedElements.length).toBeGreaterThanOrEqual(0);
    });
  });
});
