module.exports = [
  {
    id: 1,
    label: '行政界线',
    disabled: true,
    children: [
      {
        id: 2,
        type: 'sheng',
        label: '省界',
        icon: 'el-icon-my-xing-zheng-sheng',
        disabled: true
      },
      {
        id: 3,
        type: 'shi',
        label: '市界',
        icon: 'el-icon-my-xing-zheng-xian',
        disabled: true
      },
      {
        id: 4,
        type: 'xian',
        label: '县界',
        icon: 'el-icon-my-xing-zheng-shi',
        disabled: true
      },
      {
        id: 105,
        type: 'xiang',
        label: '乡镇界',
        icon: 'el-icon-my-xing-zheng-xiang',
        disabled: true
      },
      {
        id: 106,
        type: 'cun',
        label: '村界',
        icon: 'el-icon-my-xing-zheng-cun',
        disabled: true
      }
    ]
  },
  {
    id: 5,
    label: '基础信息',
    children: [
      {
        id: 6,
        type: 'jumindi',
        label: '居民地',
        icon: 'el-icon-my-ju-min-di',
        layerConfig: {
          type: ['cite:senlinziyuan_jumindi'],
          tile: null,
          zIndex: 21
        }
      },
      {
        id: 7,
        type: 'shuixi',
        label: '水系',
        icon: 'el-icon-my-shui-xi',
        layerConfig: {
          type: ['cite:senlinziyuan_shuixi'],
          tile: null,
          zIndex: 20
        }
      },
      {
        id: 22,
        type: 'railway',
        label: '铁路',
        icon: 'el-icon-my-xing-zheng-shi',
        layerConfig: {
          type: ['cite:tielu'],
          tile: null,
          zIndex: 4
        }
      },
      {
        id: 23,
        type: 'highway',
        label: '公路',
        icon: 'el-icon-my-xing-zheng-shi',
        layerConfig: {
          type: ['cite:gonglu'],
          tile: null,
          zIndex: 5
        }
      }
    ]
  },
  {
    id: 8,
    label: '资源分布',
    children: [
      {
        id: 9,
        type: 'senlin',
        label: '森林资源分布',
        // disabled: true,
        icon: 'el-icon-my-sen-lin-fen-bu',
        layerConfig: {
          type: ['cite:senlinziyuan_lindi'],
          tile: null,
          zIndex: 22
        }
      },
      {
        id: 81,
        type: 'grassLand',
        label: '草原资源分布',
        icon: 'el-icon-my-cao-yuan-fen-bu',
        layerConfig: {
          type: ['cite:senlinziyuan_caodi'],
          tile: null,
          zIndex: 23
        }
      }
    ]
  },
  {
    id: 10,
    label: '防火区划',
    children: [
      {
        id: 11,
        type: 'senlinfanghuoqu',
        label: '森林火险区划等级分布',
        icon: 'el-icon-my-cao-yuan-fang-huo',
        layerConfig: {
          type: ['senlin1', 'senlin2', 'senlin3'],
          tile: null,
          zIndex: 10
        }
      },
      {
        id: 12,
        type: 'caoyuanfanghuoqu',
        label: '草原火险区划等级分布',
        icon: 'el-icon-my-sen-lin-fang-huo-qu',
        layerConfig: {
          type: ['caoyuan1', 'caoyuan2', 'caoyuan3', 'caoyuan4'],
          tile: null,
          zIndex: 14
        }
      },
      // {
      //     id: 24,
      //     type: 'senlincaoyuanfanghuoqu',
      //     label: '森林草原防火区',
      //     icon: 'el-icon-my-slcyfhq'
      // },
      {
        id: 25,
        type: 'senlincaoyuangaohuoxianqu',
        label: '森林高火险区',
        icon: 'el-icon-my-ghx',
        layerConfig: {
          type: ['gaohuoxian1', 'gaohuoxian2'],
          tile: null,
          zIndex: 19
        }
      }
    ]
  },
  {
    id: 13,
    label: '机构人员',
    children: [
      {
        id: 16,
        type: 16,
        label: '防火机构',
        icon: 'el-icon-my-fang-huo-ji-gou',
        apiParams: {
          typeName: 'jigou'
        },
        layerConfig: {
          zIndex: 0
        }
      },
      {
        id: 14,
        type: 7,
        label: '地方专业防扑火队伍',
        icon: 'el-icon-my-xiao-fang-yuan2',
        apiParams: {
          typeName: 'fire_brigade'
        },
        layerConfig: {
          vector: null,
          zIndex: 40,
          propData: [
            { label: '地方专业防扑火队队伍名称：', prop: 'team_name' },
            { label: '队伍地址：', prop: ['provinces', 'counties', 'team_address'] },
            { label: '队伍隶属：', prop: 'team_ascription' },
            { label: '隶属单位：', prop: 'team_superior' },
            { label: '队伍人数：', prop: 'team_num' },
            { label: '队长：', prop: 'team_leader' },
            { label: '集中驻防时间：', prop: 'team_time' },
            { label: '固定电话：', prop: 'team_fixed_tel' },
            { label: '移动电话：', prop: 'team_mobile_tel' },
            { label: '填报日期：', prop: 'team_report_time' },
            { label: '填报单位：', prop: 'team_report_unit' }
          ]
        }
      }
      // {
      //     id: 18,
      //     type: 'jigouzeren',
      //     label: '机构责任区',
      //     icon: 'el-icon-my-ji-gou-ze-ren-qu'
      // }
    ]
  },
  {
    id: 15,
    label: '防火基础设施',
    children: [
      {
        id: 26,
        type: 26,
        label: '物资储备库',
        icon: 'el-icon-my-wu-zi-chu-bei-ku'
      },
      {
        id: 27,
        type: 27,
        label: '专业队营房',
        icon: 'el-icon-my-zhuan-ye-dui-ying-fang'
      },
      {
        id: 28,
        type: 28,
        label: '地面取水蓄水池',
        icon: 'el-icon-my-di-mian-qu-shui-xu-shui-chi'
      },
      {
        id: 29,
        type: 29,
        label: '瞭望塔',
        icon: 'el-icon-my-liao-wang-tai'
      },
      {
        id: 30,
        type: 30,
        label: '常年检查站',
        icon: 'el-icon-my-chang-nian-jian-cha-zhan'
      },
      {
        id: 19,
        type: 19,
        label: '临时检查站',
        icon: 'el-icon-my-lin-shi-jian-cha-zhan',
        apiParams: {
          typeName: 'lsjcz'
        },
        layerConfig: {
          zIndex: 0,
          propData: []
        }
      },
      {
        id: 32,
        type: 32,
        label: '防火道路',
        icon: 'el-icon-my-fang-huo-dao-lu'
      },
      {
        id: 33,
        type: 33,
        label: '防火阻隔带',
        icon: 'el-icon-my-fang-huo-ge-li-dai'
      },
      {
        id: 34,
        type: 34,
        label: '航空护林站',
        icon: 'el-icon-my-hang-kong-hu-lin-zhan'
      },
      {
        id: 35,
        type: 35,
        label: '永久机降点',
        icon: 'el-icon-my-yong-jiu-ji-jiang-ji-dian'
      },
      {
        id: 36,
        type: 36,
        label: '临时机降点',
        icon: 'el-icon-my-lin-shi-ji-jiang-ji-dian'
      },
      {
        id: 37,
        type: 37,
        label: '视频监控点',
        icon: 'el-icon-my-shi-pin-jian-kong-dian'
      }
    ]
  }
]
