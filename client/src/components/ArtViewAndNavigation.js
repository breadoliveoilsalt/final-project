import React from 'react'

import { Grid, Image } from 'semantic-ui-react'

import ArtistSegment from './ArtistSegment'
import TitleSegment from './TitleSegment'
import DatedSegment from './DatedSegment'
import CultureSegment from './CultureSegment'
import OptionalSegment from './OptionalSegment'

// ArtInfoSegment -- source={currentArtObject.somthing} optional={true} boldText={} plainText={} searchButton={true} searchButtonTitle={}
// searchButtonFunction={} altText={"Unattributed"}

// consider just passing currentArtObject into the various mandatory Segments...eg, in ArtistSegment, delete all the crap not used.
//
// Notes on DatedSegment:
// {/* can't just have this -- need full object to test century and get dated info -- dated={props.currentArtObject.dated} */}
// {/* buttonConditionedOn */}
// need a buttonLabel, category (title)
// altText if there is no key


// Maybe make the image a component that can show a loader
const ArtViewAndNavigation = (props) => {

  return (
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={10}>
              <Image src={props.currentArtObject.primaryImageUrl} size='large' centered />
          </Grid.Column>

          <Grid.Column width={6}>
              <TitleSegment
                title={props.currentArtObject.title}
                addToFavoritesClicked={props.addToFavoritesClicked}
                id={props.currentArtObject.id}
                favorited={props.currentArtObject.favorite}
              />

              <ArtistSegment
                currentArtObject={props.currentArtObject}
                navigationButtonClicked={props.navigationButtonClicked}
              />

              <DatedSegment
                currentArtObject={props.currentArtObject}
                navigationButtonClicked={props.navigationButtonClicked}
              />

              <CultureSegment
                currentArtObject={props.currentArtObject}
                navigationButtonClicked={props.navigationButtonClicked}/>

              <OptionalSegment
                field={props.currentArtObject.medium}
                title={"Medium"}
                text={props.currentArtObject.medium} />

              <OptionalSegment
                field={props.currentArtObject.description}
                title={"Short Description"}
                text={props.currentArtObject.description} />

              <OptionalSegment
                field={props.currentArtObject.labelText}
                title={"Wall Label Text"}
                text={props.currentArtObject.labelText} />

              <OptionalSegment
                field={props.currentArtObject.commentary}
                title={"Commentary"}
                text={props.currentArtObject.commentary} />

          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
}

export default ArtViewAndNavigation
