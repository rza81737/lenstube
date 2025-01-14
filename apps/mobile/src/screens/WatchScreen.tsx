import type { Publication } from '@lenstube/lens'
import { usePublicationDetailsQuery } from '@lenstube/lens'
import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import React from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
  View
} from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import ServerError from '~/components/ui/ServerError'
import MoreVideos from '~/components/watch/MoreVideos'
import VideoPlayer from '~/components/watch/Player'
import { useMobileTheme } from '~/hooks'
import useMobileStore from '~/store'

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeConfig.backgroudColor
    }
  })

export const WatchScreen = (props: WatchScreenProps) => {
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)

  const { top, bottom } = useSafeAreaInsets()
  const { height: windowHeight } = useWindowDimensions()

  const videoId = props.route.params.id
  const selectedChannel = useMobileStore((state) => state.selectedChannel)

  const { data, error, loading } = usePublicationDetailsQuery({
    variables: {
      request: { publicationId: videoId },
      reactionRequest: selectedChannel
        ? { profileId: selectedChannel?.id }
        : null,
      channelId: selectedChannel?.id ?? null
    },
    skip: !videoId
  })

  const publication = data?.publication as Publication
  const video =
    publication?.__typename === 'Mirror' ? publication.mirrorOf : publication

  if (error) {
    return <ServerError />
  }
  if (loading || !data) {
    return <ActivityIndicator style={style.container} />
  }

  return (
    <View style={[style.container, { top, bottom }]}>
      <VideoPlayer video={video} />

      <Animated.View style={{ height: windowHeight }} entering={FadeInDown}>
        <MoreVideos video={video} />
      </Animated.View>
    </View>
  )
}
