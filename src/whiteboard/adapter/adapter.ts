const note = {
  dragType: 'scale', // scale free
  canRotate: true,
  canLink: true,
}

const circle = {
  dragType: 'free', // scale free
  canRotate: true,
  canLink: true,
}

const rectangle = {
  dragType: 'free', // scale free
  canRotate: true,
  canLink: true,
}

const roundedRectangle = {
  dragType: 'free', // scale free
  canRotate: true,
  canLink: true,
}

const triangle = {
  dragType: 'free', // scale free
  canRotate: true,
  canLink: true,
}

const pencil = {
  dragType: 'scale', // scale free
  canRotate: true,
  canLink: true,
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
  }

  if (adapter) {
    return adapter
  } else {
    throw new Error('No matching adapter found, type is ' + type)
  }
}

export default getAdapter
