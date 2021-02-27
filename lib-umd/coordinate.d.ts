export declare type Point = [number, number];
export declare function isPointInPath(point: Point, path: Point[]): boolean;
/**
 * 根据三角函数求两点的距离
 * @param origin
 * @param target
 */
export declare function getDistance(origin: Point, target: Point): number;
export declare enum Direct {
    top = "top",
    left = "left",
    right = "right",
    bottom = "bottom"
}
/**
 * 根据目标点获取相对于原点的角度
 * 注意：默认旋转方向是向上的 所以(0,0)要顶部向着(1,1)是135度，而不是40度
 * 注意：在屏幕里角度是顺时针的与数学中的逆时针坐标不一样 45度是右下而不是右上方
 * @param origin 原点
 * @param target
 * @param direct 需要上下左右哪个方向指向目标
 */
export declare function getAngle(origin: Point, target: Point, direct?: Direct): number;
/**
 * 根据半径与角度获取点
 * @param center
 * @param radius
 * @param rotate
 */
export declare function getRotatePoint(center: Point, radius: number, rotate: number): Point;
/**
 * fixme 无法单元测试
 * 生成二阶贝塞尔曲线路径点
 * @param {number} t 当前百分比
 * @param {Array} startPos 起点坐标
 * @param {Array} endPos 终点坐标
 * @param {Array} controlPoint 控制点
 */
export declare function twoBezier(t: number, startPos: Point, endPos: Point, controlPoint: Point): Point;
/**
 * 根据余弦定理(c^2 = a^2 + b^2 - 2 * a * b * cosA)获取任意边长
 * @param a
 * @param b
 * @param angle 要获取的边长对应的角度
 */
export declare function getBorderWidthByCos(a: number, b: number, angle: number): number;
/**
 * 根据正弦定理(a/sinA = b/sinB = c/sinC)获取对应边长
 * @param a
 * @param angleA
 * @param angleB 要获取的边长对应的角度
 */
export declare function getBorderWidthBySin(a: number, angleA: number, angleB: number): number;
