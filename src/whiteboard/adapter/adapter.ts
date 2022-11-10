const note = {
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
  }

  if (adapter) {
    return adapter
  } else {
    throw new Error('No matching adapter found, type is ' + type)
  }
}

export default getAdapter
