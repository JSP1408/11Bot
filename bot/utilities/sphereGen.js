class Vector {
  constructor (x, y, z) {
    this.x = x
    this.y = y
    this.z = z
  }

  mag () {
    return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2)
  }

  normalize () {
    const mag = this.mag()

    const normal = new Vector(this.x, this.y, this.z)
    if (mag === 0) { return normal }
    normal.x /= mag
    normal.y /= mag
    normal.z /= mag

    return normal
  }

  mult (n) {
    const result = new Vector(this.x, this.y, this.z)

    if (n instanceof Vector) {
      result.x *= n
      result.y *= n
      result.z *= n
    }

    result.x *= n
    result.y *= n
    result.z *= n

    return result
  }

  div (n) {
    const result = new Vector(this.x, this.y, this.z)

    result.x /= n
    result.y /= n
    result.z /= n

    return result
  }

  sub (vector) {
    return this.add(new Vector(-vector.x, -vector.y, -vector.z))
  }

  add (vector) {
    const result = new Vector(this.x, this.y, this.z)

    result.x += vector.x
    result.y += vector.y
    result.z += vector.z

    return result
  }

  equals (vector) {
    return this.x === vector.x && this.y === vector.y && this.z === vector.z
  }
}

const untiCubeVertices = [
  new Vector(0, 0, 0),
  new Vector(1, 0, 0),
  new Vector(0, 0, 1),
  new Vector(1, 0, 1),

  new Vector(0, 0.5, 0),
  new Vector(1, 0.5, 0),
  new Vector(0, 0.5, 1),
  new Vector(1, 0.5, 1),

  new Vector(0, 1, 0),
  new Vector(1, 1, 0),
  new Vector(0, 1, 1),
  new Vector(1, 1, 1)
]

const unitCubeSides = [
  [0, 3],
  [3, 11],
  [11, 8],
  [8, 0],

  [1, 2],
  [2, 10],
  [10, 9],
  [9, 1],

  [4, 5],
  [5, 7],
  [7, 6],
  [6, 4]

]

function sphere (x, y, z, radius, details, angle) {
  const rotateduntiCubeVertices = []
  for (let i = 0; i < untiCubeVertices.length; i++) {
    const vertex = untiCubeVertices[i]
    if (angle == null || isNaN(angle)) {
      rotateduntiCubeVertices[i] = vertex
      continue
    }

    const centeredVertex = vertex.sub(new Vector(0.5, 0, 0.5))

    const x = centeredVertex.x * Math.cos(angle) + centeredVertex.z * Math.sin(angle)
    const z = -centeredVertex.x * Math.sin(angle) + centeredVertex.z * Math.cos(angle)

    const rotatedVertex = new Vector(x, vertex.y, z)
    rotatedVertex.add(new Vector(0.5, 0, 0.5))

    rotateduntiCubeVertices[i] = rotatedVertex
  }

  const vertices = []

  for (const side of unitCubeSides) {
    if (!includesVector(vertices, rotateduntiCubeVertices[side[0]])) { vertices.push(rotateduntiCubeVertices[side[0]]) }

    const midPoints = getMidPoints(rotateduntiCubeVertices[side[0]], rotateduntiCubeVertices[side[1]], details)
    for (const point of midPoints) {
      if (!includesVector(vertices, point)) { vertices.push(point) }
    }
  }

  for (let i = 0; i < vertices.length; i++) {
    const vertex = vertices[i]

    let newVertex = vertex.sub(new Vector(0, 0.5, 0))
    newVertex = newVertex.normalize()
    newVertex = newVertex.mult(radius)
    newVertex = newVertex.add(new Vector(x, y, z))

    vertices[i] = newVertex
  }

  return vertices
}

function getMidPoints (v1, v2, n) {
  if (n < 1) { return [] }

  const points = []
  for (let i = 1; i <= n; i++) {
    points.push(lerp(v1, v2, i / n))
  }

  return points
}

function lerp (v1, v2, t) {
  return v1.mult(1 - t).add(v2.mult(t))
}

function includesVector (array, vector) {
  for (const arrayVector of array) {
    if (vector.equals(arrayVector)) { return true }
  }

  return false
}

module.exports = sphere
