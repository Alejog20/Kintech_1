import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../../pages/Home';
import { LanguageContext } from '../../context/LanguageContext';

describe('Property Card Icon Alignment Tests', () => {
  const renderWithContext = (component) => {
    return render(
      <BrowserRouter>
        <LanguageContext.Provider value={{ language: 'es' }}>
          {component}
        </LanguageContext.Provider>
      </BrowserRouter>
    );
  };

  test('emoji icons are wrapped in emoji-icon class', async () => {
    renderWithContext(<Home />);

    // Wait for properties to load
    await new Promise(resolve => setTimeout(resolve, 1000));

    const emojiIcons = document.querySelectorAll('.emoji-icon');
    expect(emojiIcons.length).toBeGreaterThan(0);
  });

  test('feature elements have center alignment', () => {
    renderWithContext(<Home />);

    const features = document.querySelectorAll('.feature');
    features.forEach(feature => {
      const computedStyle = window.getComputedStyle(feature);
      expect(computedStyle.alignItems).toBe('center');
    });
  });

  test('emoji-icon elements have correct styling', () => {
    renderWithContext(<Home />);

    const emojiIcon = document.querySelector('.emoji-icon');
    if (emojiIcon) {
      const computedStyle = window.getComputedStyle(emojiIcon);
      expect(computedStyle.display).toBe('inline-block');
      expect(computedStyle.verticalAlign).toBe('middle');
      expect(computedStyle.lineHeight).toBe('1');
    }
  });

  test('all property cards render feature icons', async () => {
    renderWithContext(<Home />);

    // Wait for async data loading
    await new Promise(resolve => setTimeout(resolve, 1000));

    const featureElements = document.querySelectorAll('.feature');
    expect(featureElements.length).toBeGreaterThan(0);

    // Check that each feature has an emoji icon
    featureElements.forEach(feature => {
      const hasEmojiIcon = feature.querySelector('.emoji-icon');
      expect(hasEmojiIcon).toBeTruthy();
    });
  });

  test('location pins are properly wrapped', async () => {
    renderWithContext(<Home />);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const locationElements = document.querySelectorAll('.property-location');
    locationElements.forEach(location => {
      const emojiIcon = location.querySelector('.emoji-icon');
      expect(emojiIcon).toBeTruthy();
    });
  });
});