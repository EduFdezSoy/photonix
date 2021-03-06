import React  from 'react'
import { useQuery } from '@apollo/react-hooks'
import { useSelector } from 'react-redux'
import gql from "graphql-tag"
import Filters from '../components/Filters'
import Spinner from '../components/Spinner'


const GET_FILTERS = gql`
  {
    allLocationTags {
      id
      name
      parent {
        id
      }
    }
    allObjectTags {
      id
      name
    }
    allPersonTags {
      id
      name
    }
    allColorTags {
      id
      name
    }
    allStyleTags {
      id
      name
    }
    allCameras {
      id
      make
      model
    }
    allLenses {
      id
      name
    }
    allApertures
    allExposures
    allIsoSpeeds
    allFocalLengths
    allMeteringModes
    allDriveModes
    allShootingModes
  }
`

function createFilterSelection(sectionName, data, prefix='tag') {
  return {
    name: sectionName,
    items: data.map((tag) => {
      let item = {
        id: prefix + ':' + tag,
        name: tag,
      }
      if (tag.toString() === '[object Object]') {
        item.name = tag.name
        item.id = prefix + ':' + tag.id
        item.parent = tag.parent ? prefix + ':' + tag.parent.id : null
      }
      return item
    }),
  }
}

const FiltersContainer = ({ selectedFilters, onFilterToggle }) => {
  const user = useSelector(state => state.user)  // Using user here from Redux store so we can wait for any JWT tokens to be refreshed before running GraphQL queries that require authentication
  const { loading, error, data } = useQuery(GET_FILTERS, {skip: !user})

  if (loading) return <Spinner />
  if (error) return `Error! ${error.message}`

  let filterData = []
  if (data) {
    if (data.allObjectTags.length) {
      filterData.push(createFilterSelection('Objects', data.allObjectTags))
    }
    if (data.allLocationTags.length) {
      filterData.push(createFilterSelection('Locations', data.allLocationTags))
    }
    if (data.allPersonTags.length) {
      filterData.push(createFilterSelection('People', data.allPersonTags))
    }
    if (data.allColorTags.length) {
      filterData.push(createFilterSelection('Colors', data.allColorTags))
    }
    if (data.allStyleTags.length) {
      filterData.push(createFilterSelection('Styles', data.allStyleTags))
    }
    if (data.allCameras.length) {
      filterData.push({
        name: 'Cameras',
        items: data.allCameras.map((camera) => (
          {id: 'camera:' + camera.id, name: `${camera.make} ${camera.model}`}
        )),
      })
    }
    if (data.allLenses.length) {
      filterData.push(createFilterSelection('Lenses', data.allLenses, 'lens'))
    }
    if (data.allApertures.length) {
      filterData.push(createFilterSelection('Aperture', data.allApertures, 'aperture'))
    }
    if (data.allExposures.length) {
      filterData.push(createFilterSelection('Exposure', data.allExposures, 'exposure'))
    }
    if (data.allIsoSpeeds.length) {
      filterData.push(createFilterSelection('ISO Speed', data.allIsoSpeeds, 'isoSpeed'))
    }
    if (data.allFocalLengths.length) {
      filterData.push(createFilterSelection('Focal Length', data.allFocalLengths, 'focalLength'))
    }
    filterData.push({
      name: 'Rating',
      items: [
        {id: 'rating:1', name: 1},
        {id: 'rating:2', name: 2},
        {id: 'rating:3', name: 3},
        {id: 'rating:4', name: 4},
        {id: 'rating:5', name: 5}
      ]
    })
    filterData.push({
      name: 'Flash',
      items: [{id: 'flash:on', name: 'On'}, {id: 'flash:off', name: 'Off'}]
    })
    if (data.allMeteringModes.length) {
      filterData.push(createFilterSelection('Metering Mode', data.allMeteringModes, 'meeteringMode'))
    }
    if (data.allDriveModes.length) {
      filterData.push(createFilterSelection('Drive Mode', data.allDriveModes, 'driveMode'))
    }
    if (data.allShootingModes.length) {
      filterData.push(createFilterSelection('Shooting Mode', data.allShootingModes, 'shootingMode'))
    }
  }

  return (
    <Filters
      data={filterData}
      selectedFilters={selectedFilters}
      onToggle={onFilterToggle}
    />
  )
}

export default FiltersContainer
