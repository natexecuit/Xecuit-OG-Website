/**
 * PNG export utilities for calculator results
 */

export interface ExportOptions {
  backgroundColor?: string;
  scale?: number;
  filename?: string;
}

/**
 * Manual canvas-based export that doesn't rely on html2canvas
 * This avoids the lab() color function issue in Tailwind CSS v4
 */
export async function exportToPNG(
  elementId: string,
  filename: string = 'xecuit-calculation',
  options: ExportOptions = {}
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found`);
    return;
  }

  const {
    backgroundColor = '#F9F7F4',
    scale = 2,
  } = options;

  try {
    // Get element dimensions
    const rect = element.getBoundingClientRect();
    const width = rect.width * scale;
    const height = rect.height * scale;

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    // Scale context
    ctx.scale(scale, scale);

    // Draw background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Function to draw text
    const drawText = (text: string, x: number, y: number, size: number, weight: string = 'normal', color: string = '#264C3F') => {
      ctx.font = `${weight} ${size}px "Plus Jakarta Sans", sans-serif`;
      ctx.fillStyle = color;
      ctx.fillText(text, x, y);
    };

    // Function to parse and format currency
    const formatCurrency = (value: string | number): string => {
      if (typeof value === 'string') {
        const num = parseFloat(value.replace(/[$,]/g, ''));
        if (isNaN(num)) return value;
        value = num;
      }
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    };

    // Function to parse and format percentage
    const formatPercentage = (value: string | number): string => {
      if (typeof value === 'string') {
        const num = parseFloat(value.replace(/[%]/g, ''));
        if (isNaN(num)) return value;
        value = num;
      }
      return `${value.toFixed(2)}%`;
    };

    let yOffset = 60;

    // Draw Xecuit branding
    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    logoImg.src = '/xecuit-dark-green-logo.png';

    await new Promise((resolve, reject) => {
      logoImg.onload = resolve;
      logoImg.onerror = reject;
      setTimeout(resolve, 1000); // Timeout fallback
    });

    // Draw logo (scaled down)
    try {
      ctx.drawImage(logoImg, 24, 20, 120, 40);
    } catch (e) {
      // Fallback if logo fails to load
      drawText('XECUIT', 24, 40, 16, 'bold', '#264C3F');
    }

    drawText('CALCULATOR RESULTS', 160, 40, 10, 'normal', '#264C3F50');

    // Parse the element for results
    const resultElements = element.querySelectorAll('div.flex.justify-between.items-baseline');
    const breakdownElements = element.querySelectorAll('div.flex.justify-between.items-baseline.text-sm');

    // Draw results section
    yOffset += 40;
    drawText('RESULTS', 24, yOffset, 10, 'bold', '#9E8461');
    yOffset += 30;

    resultElements.forEach((el) => {
      const label = el.querySelector('span:first-child')?.textContent || '';
      const valueEl = el.querySelector('span:last-child');
      const valueText = valueEl?.textContent || '';

      // Format the value
      let formattedValue = valueText;
      if (valueText.includes('$')) {
        formattedValue = formatCurrency(valueText);
      } else if (valueText.includes('%')) {
        formattedValue = formatPercentage(valueText);
      }

      drawText(label, 24, yOffset, 12, 'normal', '#264C3FB0');
      drawText(formattedValue, rect.width - 24, yOffset, 16, '600', '#264C3F');

      // Measure text for alignment
      const valueWidth = ctx.measureText(formattedValue).width;
      drawText(formattedValue, rect.width - valueWidth - 24, yOffset, 16, '600', '#264C3F');

      yOffset += 35;
    });

    // Draw breakdown section if exists
    if (breakdownElements.length > 0) {
      yOffset += 20;
      drawText('BREAKDOWN', 24, yOffset, 10, 'bold', '#9E8461');
      yOffset += 30;

      breakdownElements.forEach((el) => {
        const label = el.querySelector('span:first-child')?.textContent || '';
        const valueText = el.querySelector('span:last-child')?.textContent || '';

        drawText(label, 24, yOffset, 11, 'normal', '#264C3F80');
        drawText(valueText, rect.width - 24, yOffset, 11, '500', '#264C3FCC');

        yOffset += 25;
      });
    }

    // Add timestamp
    const timestamp = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    drawText(`Generated ${timestamp}`, 24, rect.height - 20, 8, 'normal', '#264C3F40');

    // Create download link
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    // Cleanup
    link.remove();
  } catch (error) {
    console.error('Failed to export PNG:', error);
    throw new Error('Failed to export calculation as PNG');
  }
}

/**
 * Generate a timestamped filename for exports
 */
export function generateFilename(calculatorName: string): string {
  const date = new Date();
  const timestamp = date.toISOString().slice(0, 10).replace(/-/g, '');
  const time = date.toTimeString().slice(0, 5).replace(':', '');
  return `xecuit-${calculatorName}-${timestamp}-${time}`;
}
