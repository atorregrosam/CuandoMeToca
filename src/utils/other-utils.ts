function hex2rgb(color: string): { r: number; g: number; b: number; } | null {
  const colorRGB = /^\s*#?([a-f\d]{1,2})([a-f\d]{1,2})([a-f\d]{1,2})$/i.exec(color);
  return !!colorRGB ? { r: parseInt(colorRGB[1], 16), g: parseInt(colorRGB[2], 16), b: parseInt(colorRGB[3], 16) } : null;
}

function rgb2hex(red: number, green: number, blue: number): string {
  // tslint:disable-next-line: no-bitwise
  const colorHEX = ((1 << 24) + (red << 16) + (green << 8) + blue).toString(16).slice(1);
  return `#${colorHEX}`;
}

function triggerFileDownload(fileName: string, fileContents: string | string[], fileType: string = 'text/plain'): void {
  const file: Blob = new Blob([...fileContents], { type: fileType });
  const createAnchorElement = (href: string): HTMLAnchorElement => {
    const a = document.createElement('a');
    a.setAttribute('download', fileName);
    a.setAttribute('href', href);

    return a;
  };

  /// NOTE: 2e+6 max limit file size
  if(file.size >= 2e+6) {
    const anchor = createAnchorElement(URL.createObjectURL(file));
    anchor.click();
  } else {
    const fr = new FileReader();
    fr.readAsDataURL(file);
    fr.onloadend = () => {
      const anchor = createAnchorElement(fr.result as string);
      anchor.click();
    };
  }
}

function varCSS(name: string, newValue?: string): string {
  if(name.substr(0, 2) !== '--') {
    name = '--' + name;
  }

  if(newValue !== undefined) {
    document.documentElement.style.setProperty(name, newValue);
  }

  return getComputedStyle(document.documentElement).getPropertyValue(name);
}


export {
  hex2rgb,
  rgb2hex,
  triggerFileDownload,
  varCSS,
};
