export function getLocation(id: string) {
  const locations: Record<string, any> = {
    crosspoint: {
      id: 'crosspoint',
      name: 'Crosspoint Village',
      interactivePoints: [],
    },
  }
  return locations[id] || null
}

