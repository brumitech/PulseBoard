export const Interpolators = {
  number: (a: number, b: number, t: number) => a + (b - a) * t,
  
  color: (a: string, b: string, t: number) => {
    const parseColor = (color: string) =>
      color.match(/\d+/g)?.map(Number) || [0, 0, 0];
    
    const [r1, g1, b1] = parseColor(a);
    const [r2, g2, b2] = parseColor(b);
    
    return `rgb(${
      Math.round(r1 + (r2 - r1) * t)
    }, ${
      Math.round(g1 + (g2 - g1) * t)
    }, ${
      Math.round(b1 + (b2 - b1) * t)
    })`;
  },
  
  string: (a: string, b: string, t: number) => 
    t > 0.5 ? b : a
};