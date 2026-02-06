// These are the four numbers that define the transform, i hat and j hat
const i_x = 1;
const i_y = 0.5;
const j_x = -1;
const j_y = 0.5;

// Sprite size
const w = 1;
const h = 1;

function invert_matrix(a:number, b:number, c:number, d:number) {
  // Determinant 
  const det = (1 / (a * d - b * c));
  
  return {
    a: det * d,
    b: det * -b,
    c: det * -c,
    d: det * a,
  }
}

const a = i_x * 0.5 * w;
const b = j_x * 0.5 * w;
const c = i_y * 0.5 * h;
const d = j_y * 0.5 * h;

const inv = invert_matrix(a, b, c, d);

const t_Ret = {
  x: 0,
  y: 0
} 

export interface ITransform {
  // never read the return object properties twice: the same instance is used in each call for performance reasons (GC)
  to_screen_coordinate(tileX:number, tileY:number) : {x: number, y: number};
  to_screen_matrix():DOMMatrix2DInit;
  to_screen_matrix_noskew():DOMMatrix2DInit;
  // never read the return object properties twice: the same instance is used in each call for performance reasons (GC)
  to_grid_coordinate(screenX:number, screenY:number) : {x: number, y: number};
  to_grid_matrix():DOMMatrix2DInit;
}

export class NoTransform implements ITransform {
  mat: DOMMatrix2DInit = {
    a: 1.0, // scale X
    b: 0.0, // skew Y
    c: 0.0, // skew X
    d: 1.0, // scale Y
    e: 0, // translate X
    f: 0  // translate Y
  };
  inv_mat: DOMMatrix2DInit = {
    a: 1.0, // scale X
    b: 0.0, // skew Y
    c: 0.0, // skew X
    d: 1.0, // scale Y
    e: 0, // translate X
    f: 0  // translate Y
  };
  to_screen_matrix(): DOMMatrix2DInit {
    return this.mat;
  }
  to_screen_matrix_noskew(): DOMMatrix2DInit {
    return this.mat;
  }
  to_grid_matrix(): DOMMatrix2DInit {
    return this.inv_mat;
  }
  to_screen_coordinate(tileX: number, tileY: number): { x: number; y: number; } {
    t_Ret.x = tileX
    t_Ret.y = tileY
    return t_Ret
  }
  to_grid_coordinate(screenX: number, screenY: number): { x: number; y: number; } {
    t_Ret.x = screenX
    t_Ret.y = screenY
    return t_Ret
  }
}

export class IsometricTransform implements ITransform {
  mat: DOMMatrix2DInit = {
    // a: a, // scale X
    // b: b, // skew Y
    // c: c, // skew X
    // d: d, // scale Y
    a: Math.cos(Math.PI / 6),  // ≈ 0.866 (scale X)
    b: Math.sin(Math.PI / 6),  // ≈ 0.5   (skew Y)
    c: -Math.cos(Math.PI / 6), // ≈ -0.866 (skew X)
    d: Math.sin(Math.PI / 6),  // ≈ 0.5   (scale Y)
    e: 0, // translate X
    f: 0  // translate Y
  };
  mat_noskew: DOMMatrix2DInit = {
    a: 1, // no scale
    b: 0, // no skew Y
    c: 0, // no skew X
    d: 1, // no scale
    e: i_y * 0.5 * h, // translate X (was skew X)
    f: j_x * 0.5 * w  // translate Y (was skew Y)
  };
  inv_mat: DOMMatrix2DInit = {
    a: inv.a, // scale X
    b: inv.b, // skew Y
    c: inv.c, // skew X
    d: inv.d, // scale Y
    e: 0, // translate X
    f: 0  // translate Y
  };
  to_screen_matrix(): DOMMatrix2DInit {
    return this.mat;
  }
  to_screen_matrix_noskew(): DOMMatrix2DInit {
    return this.mat_noskew;
  }
  to_grid_matrix(): DOMMatrix2DInit {
    return this.inv_mat;
  }
  to_screen_coordinate(tileX: number, tileY: number): { x: number; y: number; } {
    t_Ret.x = tileX * i_x * 0.5 * w + tileY * j_x * 0.5 * w
    t_Ret.y = tileX * i_y * 0.5 * h + tileY * j_y * 0.5 * h
    return t_Ret
  }
  to_grid_coordinate(screenX: number, screenY: number): { x: number; y: number; } {
    t_Ret.x = screenX * inv.a + screenY * inv.b
    t_Ret.y = screenX * inv.c + screenY * inv.d
    return t_Ret
  }
}

export class Transforms {
  private static readonly default:ITransform = new NoTransform();
  static Default(): ITransform {
    return this.default
  }
  private static readonly isometric:ITransform = new IsometricTransform();
  static Isometric(): ITransform {
    return this.isometric
  }
}