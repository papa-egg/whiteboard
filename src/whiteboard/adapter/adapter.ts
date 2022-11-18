const note = {
  dragType: 'scale', // scale free point
  canRotate: true,
  canLink: true,
}

const circle = {
  dragType: 'free',
  canRotate: true,
  canLink: true,
}

const rectangle = {
  dragType: 'free',
  canRotate: true,
  canLink: true,
}

const roundedRectangle = {
  dragType: 'free',
  canRotate: true,
  canLink: true,
}

const triangle = {
  dragType: 'free',
  canRotate: true,
  canLink: true,
}

const pencil = {
  dragType: 'scale',
  canRotate: true,
  canLink: true,
}

const line = {
  dragType: 'point',
  canRotate: false,
  canLink: false,
}

const getAdapter = (type: string) => {
  let adapter: any

  switch (type) {
    case 'note': {
      adapter = note

      break
    }

    case 'circle': {
      adapter = circle

      break
    }

    case 'rectangle': {
      adapter = rectangle

      break
    }

    case 'rounded-rectangle': {
      adapter = roundedRectangle

      break
    }

    case 'triangle': {
      adapter = triangle

      break
    }

    case 'pencil': {
      adapter = pencil

      break
    }

    case 'line': {
      adapter = line

      break
    }
  }

  if (adapter) {
    return adapter
  } else {
    throw new Error('No matching adapter found, type is ' + type)
  }
}

export default getAdapter
