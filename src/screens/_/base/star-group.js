/*
 * @Author: czy0729
 * @Date: 2019-03-18 13:33:15
 * @Last Modified by: czy0729
 * @Last Modified time: 2021-11-15 20:55:20
 */
import React from 'react'
import { Text, Touchable, Iconfont, Flex } from '@components'
import { _ } from '@stores'
import { getRating } from '@utils/app'
import { ob } from '@utils/decorators'

export const StarGroup = ob(
  class extends React.Component {
    static defaultProps = {
      value: 0,
      onChange: Function.prototype
    }

    state = {
      value: this.props.value || 0
    }

    UNSAFE_componentWillReceiveProps({ value }) {
      if (value !== this.state.value) {
        this.setState({
          value
        })
      }
    }

    clear = () => {
      const { onChange } = this.props
      this.setState({
        value: 0
      })
      onChange(0)
    }

    change = item => {
      const { onChange } = this.props
      const { value } = this.state
      let _value
      if (value / 2 >= item) {
        _value = item * 2 - 1
      } else {
        _value = item * 2
      }

      this.setState({
        value: _value
      })
      onChange(_value)
    }

    render() {
      const { style } = this.props
      const { value } = this.state
      return (
        <>
          <Flex style={[styles.desc, style]}>
            {value !== 0 && (
              <>
                <Text type='warning' size={16}>
                  {getRating(value)}
                </Text>
                <Text style={_.ml.sm} type='sub' size={16}>
                  /
                </Text>
                <Touchable style={styles.touchClear} onPress={this.clear}>
                  <Text type='sub' size={16}>
                    清除
                  </Text>
                </Touchable>
              </>
            )}
          </Flex>
          <Flex style={_.mt.xs}>
            {[1, 2, 3, 4, 5].map(item => {
              let type
              if (value / 2 >= item) {
                type = 'md-star'
              } else if (value / 2 >= item - 0.5) {
                type = 'md-star-half'
              } else {
                type = 'md-star-outline'
              }
              return (
                <Touchable
                  key={item}
                  style={[styles.touchStar, item > 1 && _.ml.sm]}
                  onPress={() => this.change(item)}
                >
                  <Iconfont
                    name={type}
                    size={36}
                    color={type === 'md-star-outline' ? _.colorIcon : _.colorWarning}
                  />
                </Touchable>
              )
            })}
          </Flex>
        </>
      )
    }
  }
)

const styles = _.create({
  desc: {
    height: 22
  },
  touchClear: {
    paddingHorizontal: _.xs,
    marginLeft: _.sm - _.xs,
    borderRadius: _.radiusSm,
    overflow: 'hidden'
  },
  touchStar: {
    borderRadius: 20,
    overflow: 'hidden'
  }
})
