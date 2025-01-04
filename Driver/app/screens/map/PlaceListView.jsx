// import { View, Text, FlatList} from 'react-native'
// import React, { useEffect, useRef, useContext } from 'react'
// import PlaceItem from './PlaceItem'
// import Dimentions from 'react-native/Libraries/Utilities/Dimensions'

// import { SelectMarkerContext } from '../../Context/SelectMarkerContext'



// export default function PlaceListView({placeList}) {

//   const flatListRef=useRef(null);
//   const {selectedMarker,setSelectedMarker}=useContext(SelectMarkerContext);

//   useEffect(() => {
//     if (selectedMarker !== null && placeList.length > selectedMarker) {
//       scrollToIndex(selectedMarker);
//     }
//   }, [selectedMarker, placeList]);

//   const scrollToIndex=(index)=>{
//     flatListRef.current?.scrollToIndex({animated:true,index});
//   }

//   const getItemLayout = (_,index) => ({
//     length:Dimentions.get('window').width,
//     offset:Dimentions.get('window').width*index+1,
//     index  
//   });
  
//   return (
//     <View>
//       <FlatList
//         data={placeList}
//         horizontal={true}
//         pagingEnabled
//         ref={flatListRef}
//         getItemLayout={getItemLayout}
//         showsHorizontalScrollIndicator={false}
//         renderItem={({item,index})=>(
//         <View key={index}>
//           <PlaceItem place={item}/>
//         </View>
//         )}
//       />
//     </View>
//   )
// }

//newly added delete in case of error

import { View, FlatList, Dimensions } from 'react-native';
import React, { useEffect, useRef, useContext } from 'react';
import { Button } from 'react-native';
import PlaceItem from './PlaceItem';
import { SelectMarkerContext } from '../../Context/SelectMarkerContext';

const screenWidth = Dimensions.get('window').width;

export default function PlaceListView({ placeList }) {
  const flatListRef = useRef(null);
  const { selectedMarker, isMarkerTouched} = useContext(SelectMarkerContext);

  //scolling markers
  useEffect(() => {
    if (selectedMarker !== null && placeList.length > selectedMarker) {
      scrollToIndex(selectedMarker);
    }
  }, [selectedMarker, placeList]);

  //scrolling to the selected marker
  const scrollToIndex = (index) => {
    flatListRef.current?.scrollToIndex({ animated: true, index });
  };

  const getItemLayout = (_, index) => ({
    length: screenWidth * 0.95 + 20, // item width + margin
    offset: (screenWidth * 0.95 + 20) * index,
    index,
  });

  return (
    <View>
      
        
        
        <FlatList
          data={placeList}
          horizontal={true}
          pagingEnabled
          ref={flatListRef}
          getItemLayout={getItemLayout}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <View key={index}>
              <PlaceItem place={item}  style={{ width: screenWidth, justifyContent: 'center', alignItems: 'center' }}/>
            </View>
          )}
        />
      
     
    </View>
  );
}
