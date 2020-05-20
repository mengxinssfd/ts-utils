type Point = [number, number]

// 判断是否在范围内
function inRange(a: number, [x1, x2]: Point): boolean {
    return (x1 <= a && a <= x2) || (x2 <= a && a <= x1);
}

// 判断某个点是否在某个线上
export function isPointInPath(point: Point, path: Point[]): boolean {
    const [x, y] = point;
    for (let i = 1; i < path.length; i++) {
        const [x1, y1] = path[i - 1];
        const [x2, y2] = path[i];

        // 根据向量的坐标运算  判断是否平行
        // 对于非0向量a,b 设a=(x1,y1) b=(x2,y2) 则a平行b <=>  x1/x2 = y1/y2
        const vector1 = (y2 - y1) / (x2 - x1);
        const vector2 = (y - y1) / (x - x1);

        // 判断是否在范围内
        if (vector2 === vector1 && inRange(x, [x1, x2]) && inRange(y, [y1, y2])) return true;
    }
    return false;
}

// TODO 未测
/**
 * 根据三角函数求两点的距离
 * @param origin
 * @param target
 */
export function getDistance(origin: Point, target: Point): number {
    const [x1, y1] = origin;
    const [x2, y2] = target;
    const x = x1 - x2;
    const y = y1 - y2;
    return Math.sqrt(x * x + y * y);
}

/**
 * 根据目标点获取相对于原点的角度
 * @param origin 原点
 * @param target
 */
export function getAngle(origin: Point, target: Point): number {
    const [x1, y1] = origin;
    const [x2, y2] = target;

    // 相对数学坐标系是对的，对于屏幕坐标系不对
    // x = x1 - x2
    // y = y1 - y2
    // r = Math.sqrt(x * x + y * y)
    // angle = Math.round(Math.asin(y / r) / Math.pi * 180)

    // 在两点x轴相同时不对
    // const x = x1 - x2;
    // const y = y1 - y2;
    // const r = Math.sqrt(x * x + y * y);
    // if (r === 0) return 0;
    // return Math.round(Math.acos(x / r) / Math.PI * 180) - 90;

    // https://blog.csdn.net/chelen_jak/article/details/80518973
    const angle = Math.atan2((x2 - x1), (y2 - y1)); //弧度  0.9272952180016122
    const theta = angle * (180 / Math.PI); //角度  53.13010235415598

    return 180 - theta;
}

/**
 * 根据半径与角度获取点
 * @param center
 * @param radius
 * @param rotate
 */
export function getPointByRotate(center: Point, radius: number, rotate: number): Point {
    const angle = Math.PI / 180 * rotate;

    // 圆的参数方程 圆心(a,b) x = a + r * cos; y = b + r * sin;
    // 或正弦定理 a/sinA = b/sinB
    // 因为屏幕上的坐标系与数学上的坐标系不同，所以x，y有所变化
    let x = center[0] + radius * Math.sin(angle);
    let y = center[1] - radius * Math.cos(angle);
    return [x, y];
}

/**
 * 生成二阶贝塞尔曲线路径点
 * @param {number} t 当前百分比
 * @param {Array} startPos 起点坐标
 * @param {Array} endPos 终点坐标
 * @param {Array} controlPoint 控制点
 */
export function twoBezier(t: number, startPos: Point, endPos: Point, controlPoint: Point): Point {
    const [x1, y1] = startPos;
    const [cx, cy] = controlPoint;
    const [x2, y2] = endPos;
    let x = (1 - t) * (1 - t) * x1 + 2 * t * (1 - t) * cx + t * t * x2;
    let y = (1 - t) * (1 - t) * y1 + 2 * t * (1 - t) * cy + t * t * y2;
    // x = Math.floor(x);
    // y = Math.floor(y);
    return [x, y];
}