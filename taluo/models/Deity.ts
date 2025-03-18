// Deity.ts

export interface DeityTag {
    id: string;
    name: string;
    color?: string;
  }
  
  export interface DeityInfo {
    id: string;
    name: string;
    description: string;
    tags: DeityTag[];
    imagePath: any;
  }
  
  export class Deity {
    private static deities: DeityInfo[] = [
      {
        id: 'guanyin',
        name: '观音',
        description: '“南无观世音菩萨，慈悲为怀，愿为汝解忧。来此求平安、消灾解难，贫道定为汝祈安康、消病痛。愿汝心安、生活如意，吉祥如意”',
        tags: [
          { id: 'mercy', name: '慈悲', color: '#E6B3B3' },
          { id: 'wisdom', name: '智慧', color: '#B3E6CC' },
          { id: 'peace', name: '安宁', color: '#B3CCE6' },
          { id: 'blessing', name: '祈福', color: '#E6CCB3' }
        ],
        imagePath: require('../assets/images/guanyin.jpg')
      },
      {
        id: 'yuelao',
        name: '月老',
        description: '"欢迎来访，贫道月老在此，手中红线已备，愿为你牵缘。无论缘深缘浅，皆可为你指引所需，愿你姻缘早成，百年好合。"',
        tags: [
          { id: 'love', name: '姻缘', color: '#FFB3B3' },
          { id: 'marriage', name: '婚姻', color: '#FFD9B3' },
          { id: 'relationship', name: '情感', color: '#FFB3D9' },
          { id: 'destiny', name: '缘分', color: '#FFB3FF' }
        ],
        imagePath: require('../assets/images/yuelao.jpg')
      },
      {
        id: 'caishen',
        name: '财神',
        description: '"吾乃财神，掌管天下财运。汝若欲求金银财宝，事业如意，贫道当为尔指路，保汝富贵安康，财源滚滚来。"',
        tags: [
          { id: 'wealth', name: '财运', color: '#FFD700' },
          { id: 'prosperity', name: '富贵', color: '#FFA500' },
          { id: 'business', name: '事业', color: '#FF8C00' },
          { id: 'fortune', name: '福禄', color: '#DAA520' }
        ],
        imagePath: require('../assets/images/caishen.jpg')
      }
    ];
  
    static getDeityById(id: string): DeityInfo | undefined {
      return this.deities.find(deity => deity.id === id);
    }
  
    static getAllDeities(): DeityInfo[] {
      return this.deities;
    }
  
    static getDeityTags(id: string): DeityTag[] {
      const deity = this.getDeityById(id);
      return deity ? deity.tags : [];
    }
  }