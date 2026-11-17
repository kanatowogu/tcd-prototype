import { Language } from '../types';

/* ============================================================================
 * TCD V2 扩展叙事资产：第 2 项（开场、闲聊池与手册）& 第 3 项（#01–#05 卷宗）
 * 世界观质地：1980 年代模拟科技（打孔卡、复写纸、磁带盘、拨号内线、黑白炭灰 CRT）
 *             + 架空市政异世界质感（非现代中国、非写实美国）
 * ============================================================================ */

export type V2RedactTargetId =
  | 'f1_target1'
  | 'f1_target2'
  | 'f3_target1'
  | 'f4_target1'
  | 'f5_target1';

export interface ManualRuleItem {
  id: string;
  title: string;
  text: string;
  lateAnnotation: string; // 阶段三 (lensBroken) 才浮现的蓝黑圆珠笔批注
}

export interface ExpandedAsset1 {
  openingBadge: string;
  groundingPrompt: string;
  groundingCountdown: (sec: number) => string;
  groundingComplete: string;
  openingMonologue: string; // <= 32 字 / <= 16 words
  loginButton: string;
  systemWakeUp: string;
  wakeUpInnerVoice: string; // <= 32 字 / <= 16 words
  randomIdleBanter: string[]; // 摸鱼/间隙随机吐槽池（<= 32 字 / <= 16 words）
  manualTitle: string;
  manualSubtitle: string;
  manualPreface: string;
  manualAppendixTips: string[];
  manualFooterNote: string;
  rules: ManualRuleItem[];
}

export interface V2RedactTargetEntry {
  id: V2RedactTargetId;
  violationTag: string;
  text: string;
  innerVoice: string; // <= 32 字 / <= 16 words
}

export interface ExpandedAsset2Dossiers {
  file01: {
    title: string;
    metadata: string;
    preamble: string;
    entries: Array<
      | { kind: 'normal'; id: string; text: string }
      | { kind: 'target'; data: V2RedactTargetEntry }
    >;
    alteredRetrospective: {
      metadata: string;
      recoveredLines: string[];
      systemNote: string;
    };
  };
  file02: {
    title: string;
    metadata: string;
    memoHeader: string;
    sections: string[];
    innerVoice: string;
  };
  file03: {
    title: string;
    stageA: {
      metadata: string;
      paragraphs: string[];
      systemLock: string;
    };
    stageB: {
      metadata: string;
      paragraphs: string[];
      target1: V2RedactTargetEntry;
      bleedThrough: {
        header: string;
        caption: string;
        innerVoice: string;
      };
    };
  };
  file04: {
    title: string;
    metadata: string;
    intro: string;
    rows: string[];
    target1: V2RedactTargetEntry;
    signpostHint: string;
  };
  file05: {
    title: string;
    metadata: string;
    paragraphs: string[];
    target1: V2RedactTargetEntry;
  };
}

export interface ExpandedItem2And3Assets {
  asset1: ExpandedAsset1;
  asset2_dossiers: ExpandedAsset2Dossiers;
}

export const EXPANDED_SCRIPT_ITEMS_2_3: Record<Language, ExpandedItem2And3Assets> = {
  zh: {
    /* ========================================================================
     * 【第 2 项】开场注视锚定、打工人日常闲聊池与《部门操作手册》
     * ======================================================================== */
    asset1: {
      openingBadge: 'TCD 班前准入规程 // 终端 #302',
      groundingPrompt:
        '【员工视觉与专注度校准】：请保持视线注视工位旁家庭照片 5 秒，完成班前打卡后登入。',
      groundingCountdown: (sec: number) => `视线停留校准：${sec} 秒`,
      groundingComplete: '校准通过：焦距与脉搏指标正常',
      openingMonologue: '又是这套班前打卡。五、四、三、二、一。好了，家里人都安好，开机干活。',
      loginButton: '[登入 TCD-302 档案终端]',

      systemWakeUp:
        '>>> TCD-302 炭灰监视器已唤醒 | 夜班 (23:00–07:00) | 待核销卷宗：5 份 | 室温：19℃',
      wakeUpInnerVoice: 'Arthur 今天调休了，桌上还留着杯温咖啡。先看看左手边的操作手册吧。',

      randomIdleBanter: [
        '这个月的夜班津贴扣完市政税，只够多买两听罐头火腿。',
        '二号茶水间的速溶菊苣咖啡像洗锅水，还是自带咖啡粉划算。',
        '希望一楼食堂今晚还剩大麦浓汤，晚十分钟就只有干黑麦面包了。',
        '转椅气压棒每次往下沉一寸，我都怀疑弹簧底座要彻底散架。',
        'E-11 的米娜上周借走我的红色订书机，到现在还没还回来。',
        '头顶数过来第四块天花板有个水渍，盯久了像一只歪脖子的鹅。',
        '真羡慕凯勒能调去一楼朝东的窗边工位，虽然整天听得到有轨电车响。',
        '夜班其实不赖，起码不用在早班电车里挤着闻别人的湿羊毛大衣。',
        '新领的蓝色圆珠笔写五个字漏一坨油，简直跟手腕过不去。',
        '发薪日第一件事，就是把欠房东的两张水电缴费单一次性结清。',
        '听说三楼缩微胶片室年底有模范津贴，地下室八成轮不到我们。',
        '左脚羊毛袜又滑到鞋跟底下了，隔着硬皮鞋踩着真让人心烦。',
      ],

      manualTitle: '《部门文档脱敏与规范化操作手册》',
      manualSubtitle: '市政地下档案分处 · B区夜班文员通用本（第四版）',
      manualPreface:
        '前言：本分处负责市政设施、后勤调度及旧区档案的磁带录入与脱敏作业。请专员保持客观冷静。本手册属工位公物，严禁撕页、折纸或垫在热汤碗下。',
      manualAppendixTips: [
        '附录 A（耗材申领）：更换打印机色带或油墨盒前，须向一楼调度窗提交 M-12 复写联，严禁私自撬开废粉仓。',
        '附录 B（茶水间公约）：带铝箔封盖的餐盒禁止直接放入电烤炉加热；用完陶瓷杯请顺手冲净茶渍。',
        '附录 C（用电安全）：地下室冬季阴冷，但严禁私接 300W 以上的电热丝暖脚器，违者扣除半日出勤券。',
        '附录 D（夜班纪律）：允许自带保温壶提神，禁止拼椅躺卧；遇日光灯管闪烁请登记灯号，勿踩桌拆卸。',
      ],
      manualFooterNote: '“保持桌面整洁，维持记录连贯。祝您当班顺利。”',

      rules: [
        {
          id: '守则 01｜表述客观性规范',
          title: '剔除主观抱怨与无依据猜测',
          text: '归档日志须采用中性行政用语。凡出现个人牢骚、未经维修班证实的异响猜测（如“像有人在敲铁皮”），均须涂黑并盖章。',
          lateAnnotation:
            '圆珠笔批注：别写“指甲刮铁板”或“咀嚼废纸”。统一改写成“西侧水泵热胀冷缩”。',
        },
        {
          id: '守则 02｜考勤口径一致性',
          title: '禁止私自议论人员去向',
          text: '人员在岗与调休以人事部打孔总表为准。若一线日志出现同事行踪猜测或“找不到人”等描述，须立即涂黑。',
          lateAnnotation:
            '圆珠笔批注：C-14 和 #209 都没走丢。他们现在都在 3 号铁皮柜里，按全勤算。',
        },
        {
          id: '守则 03｜跨库检索隔离',
          title: '严守工位检索边界',
          text: '值班文员仅处理当班队列，严禁擅自交叉核对自身工位编号（#302）与历史封存缩微胶片库。',
          lateAnnotation:
            '圆珠笔批注：第 1,095 天。今天也别撕左下角照片背面的胶带，胶水已经和漆皮粘死了。',
        },
      ],
    },

    /* ========================================================================
     * 【第 3 项】5 份核心档案正文（#01 ~ #05）及 #01 回溯篡改版
     * 风格：单行短小留白，像真实 80 年代打印件；90% 无关废话 + 10% 侦探级伏笔
     * ======================================================================== */
    asset2_dossiers: {
      /* ----------------------------------------------------------------------
       * 档案 #01：阶段一（B区夜班保洁交接本，12 条轻快好读的日常流水账）
       * ---------------------------------------------------------------------- */
      file01: {
        title: '档案 #01｜B区夜班后勤与保洁交接日志',
        metadata: '编号: TCD-LOG-B1114 | 班次: 夜班 (22:30–02:00) | 填报: 保洁组 C-14 (林)',
        preamble: '说明：手写交接簿转抄件。请依《手册》划除非规范口语与无据猜测。',
        entries: [
          {
            kind: 'normal',
            id: 'f1_n1',
            text: '22:35 — 在一楼打卡机压完考勤卡，乘 2 号货梯下 B 区。今晚西墙踢脚线返潮，拿干拖把擦了一遍，摆了黄警告牌。',
          },
          {
            kind: 'normal',
            id: 'f1_n2',
            text: '22:48 — 西侧楼梯消防栓箱顶上塞着半张油纸，包着没吃完的凉肉馅饼，招了一圈小蚂蚁。已经夹进黑袋子了。',
          },
          {
            kind: 'normal',
            id: 'f1_n3',
            text: '23:02 — 在休息角老式投币机投了三枚硬币买热肉汤，机器卡嗒响了半天，只滚出两颗快化掉的薄荷糖。白亏三枚币。',
          },
          {
            kind: 'normal',
            id: 'f1_n4',
            text: '23:12 — 茶水间水池滤网被隔夜茶渣堵住了，拿铁丝钩通。另外提醒早班：这边电热炉插座没电，热饭得去一楼。',
          },
          {
            kind: 'normal',
            id: 'f1_n5',
            text: '23:20 — 把报刊架上的旧《市政简报》码齐。上月底那几本全让谁洒的凉水泡卷了边。',
          },
          {
            kind: 'target',
            data: {
              id: 'f1_target1',
              violationTag: '违反守则 01（私人生活吐槽）',
              text: '23:28 — 替 #302 工位倒纸篓，全是攥成硬团的废打印纸，桌沿还丢着半个发黑的苹果核。再这样真要招老鼠。',
              innerVoice: '被林大姐点名批评了，挺不好意思的。这句太像闲话，划掉吧。',
            },
          },
          {
            kind: 'normal',
            id: 'f1_n6',
            text: '23:36 — 走廊尽头盥洗室第二盏灯拉绳有点卡，得连拽两下才亮。上回老张换的灯泡，明天开张报修复写条。',
          },
          {
            kind: 'normal',
            id: 'f1_n7',
            text: '23:44 — 配电箱底下捡到半截蓝圆珠笔芯和一张纸条，写着“D-08 凯勒借走 3 号扳手”。已放回工具箱。',
          },
          {
            kind: 'target',
            data: {
              id: 'f1_target2',
              violationTag: '违反守则 02（未经核实的人员猜测）',
              text: '23:52 — 路过 #209 磨砂玻璃，听见 3 号大铁皮柜那边有人翻纸袋。以为是 Arthur 回来收拾东西，探头看却没见人，大概走了。',
              innerVoice: 'Arthur 肯定上楼交钥匙去了。没核实的猜测按守则涂黑。',
            },
          },
          {
            kind: 'normal',
            id: 'f1_n8',
            text: '00:08 — 东头主排风扇今晚嗡嗡声稍微偏沉，不过出风口风量正常，铁壳摸着也不烫。',
          },
          {
            kind: 'normal',
            id: 'f1_n9',
            text: '00:24 — 清空五个隔断的废纸篓，装满两大袋，多半是行政部打错页码的作废表单。',
          },
          {
            kind: 'normal',
            id: 'f1_n10',
            text: '00:40 — 垃圾车推上一楼倾倒完毕，抹布泡了氯水。B 区今晚挺安静，就是一直有点闷。交接正常。',
          },
        ],

        alteredRetrospective: {
          metadata: '编号: DIGESTION-LOG-302 | 原章剥落：[记录已规范化] -> [物理装订已完成]',
          recoveredLines: [
            '23:28 — [被 #302 涂黑覆盖的原文]：“#302 桌下根本没垃圾桶。他正把带红印油的碎纸条混着咬下的指甲往嘴里塞，对着空壁板说炖肉真香。”',
            '23:52 — [被 #302 涂黑覆盖的原文]：“3 号铁皮柜门缝卡着半截咬断的棉绳，挂着 Arthur 的 #209 工牌。柜门从里头反锁，有人用指节顶着铁皮。”',
          ],
          systemNote:
            '系统回溯审计：操作员 #302 已于阶段一亲手盖章清除上述目击记录。C-14 工牌现已与 M-04 传单完成双钉装订。',
        },
      },

      /* ----------------------------------------------------------------------
       * 档案 #02：阶段一（周度行政综合通报 —— 短句分段，90% 鸡毛蒜皮，极易快速扫读）
       * ---------------------------------------------------------------------- */
      file02: {
        title: '档案 #02｜市政档案分处周度运维与行政简报',
        metadata: '编号: SEC-209-A | 签发日期: 11月13日 | 分发: 内部传阅',
        memoHeader: '抄送：一楼 A 区大厅、地下 B 区各工位、设施维修班、财务科',
        sections: [
          '1. 【排水泵巡检】周二凌晨西侧 2 号集水泵运行 45 分钟，压力表 0.38 MPa，阀门无渗漏。',
          '2. 【禁用高功率暖脚器】巡查发现私接电热丝暖脚器导致 B 区 3 号分路多次跳闸，现已暂扣 D-08 凯勒名下格纹暖脚器一只。',
          '3. 【一楼夜宵菜单调整】因谷物供应商延误，22:30 后暂停供应热肉汤与大麦粥，暂改配黑麦干面包、盐渍萝卜与淡茶。',
          '4. 【投币汤饮机故障】休息角投币机屡现“吞币不出罐、错吐薄荷糖”故障，月底由厂商拆机检修，请勿拍打玻璃门。',
          '5. 【失物招领】一楼 E-11（米娜）遗失红色金属订书机一把（侧面贴有圆形黄笑脸贴纸）及半盒 12 号钉，借用者请于周五归还 A-04。',
          '6. 【色带与碳粉】A 区 2 号复印机碳粉余量不足 15%，夜间勿批量印制超过五十页的厚附件。',
          '7. 【夜班补助计税】本月起夜班津贴与餐券统一并入基本薪资扣税，明细请看月末打孔薪资条，勿反复拨打财务内线 204。',
          '8. 【人事调动】地下 B 区档案员 #209（Arthur）因长期夜班失眠申请平调，自 11 月 13 日起暂停 B 区值守，转至三楼白班组。',
          '9. 【当班绩效】B 区档案员 #302 本周核销 14 份积压卷宗，准确率 100%，无越权检索记录，予以通报表扬。',
          '10. 【消防通道】三号步行楼梯平台严禁堆放空纸箱与塑料桶，周日上午九点统一清运销毁。',
          '11. 【闭馆提示】离岗前请关闭台灯并锁紧铁皮柜门，防止地下湿气令纸页卷边。',
        ],
        innerVoice: '凯勒的暖脚器果然被收走了……Arthur 13 号调去三楼，难怪隔壁这么安静。',
      },

      /* ----------------------------------------------------------------------
       * 档案 #03：阶段二（#209 Arthur 的未归档草稿 —— 呼吸感强、口语化、像睡不够的同事）
       * ---------------------------------------------------------------------- */
      file03: {
        title: '档案 #03｜#209 工位未归档备忘草稿',
        stageA: {
          metadata: '编号: DRAFT-209-TMP | 作者: ARTHUR | 状态: 权限锁定 (需先完成 #01 脱敏)',
          paragraphs: [
            '草稿（暂存本地）：受够楼上那条永远在喘气的旧铸铁暖气片了，连续三周白天根本合不上眼。',
            '昨晚去一楼食堂又只剩硬黑麦面包。回 B 区想投币买罐热汤，破机器██吞了三枚硬币，气得我想██。',
            '顺手记一笔：下午在 2 号公用柜翻胶水时，扫到 #302 的入职底表。页码乱跳，前半页像███诊所随访表，后面粘着███。',
            '还有他监视器边上贴的“全家福”，凑近看根本不是合影，是张███旧协查单。',
          ],
          systemLock: '[系统锁定：请先完成《档案 #01》中的常规涂黑，以同步检索权限。]',
        },
        stageB: {
          metadata: '编号: DRAFT-209-TMP | 作者: ARTHUR | 存稿: 11月14日 01:48',
          paragraphs: [
            '草稿（明早交给人事科）：楼上老铸铁暖气片白天咚咚敲个没完，外加街口电车叮当响，连续三周每天睡不到四小时。刚数一叠传票数错了三遍页码。',
            '昨晚去一楼食堂晚了十分钟，果然只剩硬邦邦的黑麦面包。回来顺手投币买罐热肉汤，机器吞了硬币连薄荷糖都没掉。这地下室除了潮石灰味和柠檬消毒水，真让人受够。',
            '记件怪事，也许是我缺觉看岔了：下午去 2 号公用柜拿浆糊，最底下滑出一份贴着 #302 的人事底档。纸薄得像旧新闻纸，前半截是撕掉抬头的精神科随访单，背面用浆糊粘着空白的防空井验收表，入职日期一栏空着。',
            '还有件事挺奇怪：B 区茶水间上礼拜就因为跳闸断了电热炉，可每次经过 #302 隔断，里头总飘出一股浓浓的炖牛肉味。刚才绕过去看了一眼，他正用勺子往嘴里送一团湿糊糊的灰白东西——大概是泡软了的黑麦面包吧。',
            '最让我别扭的是监视器左下角那张“全家福”。前天他拿起来问我，为什么每天下班都不回家吃饭。我凑近一看，发黄胶带底下根本不是合影——左边是三年前的走失女童协查单（M-04），右边紧贴着剪下来的保洁员 C-14 胸牌复印件。',
            '我刚想问他是不是加班太狠了，他眼神直接穿过了我肩膀，对着背后水泥墙温和地点了点头，说妻子和女儿都在 3 号柜里等他。',
          ],
          target1: {
            id: 'f3_target1',
            violationTag: '违反守则 03（越权翻阅员工人事底档）',
            text: '02:11 — 不写了，越写越疑神疑鬼。刚关掉监视器揉眼睛，黑屏反光里好像有人站在我椅子正后方，手里捏着一把贴了黄笑脸贴纸的红订书机——肯定是我眼花看成巡夜的凯勒了。',
            innerVoice: 'Arthur 熬夜熬出幻觉了。把这行胡话涂黑，免得影响他调岗。',
          },
          bleedThrough: {
            header: '[墨迹未干 // 夹层底片：CCTV_SectorB.png · 02:14]',
            caption: '监控静帧：B区走廊全黑无人。3 号铁皮柜门虚掩两寸，底部滑轨夹着半截蓝色工牌挂绳。',
            innerVoice: '色带漏墨了？……可这张 02:14 的监控照片，怎么压在 Arthur 草稿背面？',
          },
        },
      },

      /* ----------------------------------------------------------------------
       * 档案 #04：阶段二（十一日水电、库房与机械打卡钟核对表 —— 清爽的表格行）
       * ---------------------------------------------------------------------- */
      file04: {
        title: '档案 #04｜地下B区十一日能耗、库房及打卡钟对账单',
        metadata: '编号: FAC-B-409 | 周期: 11月06日 — 11月17日 | 制表: 设施审计科',
        intro: '注：汇总机械电表、耗材领用单及考勤打卡钟读数，请对照工位现场实物复核。',
        rows: [
          '01. [排水泵] 西侧 2 号集水泵运行 18.4 小时（41.2 kWh），止回阀正常。',
          '02. [消防器] 走廊 4 具干粉灭火器压力均在绿区，铅封完好。',
          '03. [灯管库存] 库房存 T8 日光灯管 12 支；上月由维修班 D-08 凯勒领走 2 支换于一楼。',
          '04. [茶水间断电] B区咖啡炉与电热板因烧毁保护器，自 11 月 06 日贴封条断电（停用第 11 天，功耗 0.00 kWh）。',
          '05. [一楼餐券] 11月13–17日夜宵券核销：D-08（4次）、E-11（3次）、门卫（5次）；#302 工位：[0 次]。',
          '06. [文具损耗] 一楼本月领用 12 号订书钉 6 盒（含 E-11 米娜补领 1 盒）、打印色带 4 盘、牛皮纸袋 150 只。',
          '07. [货梯停运] 通往 B 区的 2 号机械升降井因钢索磨损停运检修，仅保留步行铁梯。',
          '08. [除湿盒] 本周更换硅胶除湿盒 4 组，其中 3 号铁皮柜旁一组已完全吸满水渍。',
          '09. [打卡钟 — C-14 林] 11月14日 22:58 打入区卡；此后 72 小时内：[无下班打卡记录]。',
          '10. [打卡钟 — #209 Arthur] 11月13日 07:12 正常打出区卡；此后至 17 日：[无任何入区或三楼打卡]。',
          '11. [打卡钟 — D-08 / E-11] 近期考勤均位于一楼 A 区与三楼，无下井记录。',
          '12. [旧案抽检 — M-04] 三年前走失女童档案袋附页证件照缺失，裁剪缺口 2.1cm × 2.8cm。',
        ],
        target1: {
          id: 'f4_target1',
          violationTag: '审计异常（请复核桌面实物）',
          text: '13. [异常备注] 茶水间断电 11 天、货梯停运且 #302 未领餐券，系统却连续登记“热咖啡与温热炖菜便当”。请核对工位实物。',
          innerVoice: '咖啡炉断电十一天、货梯也停了？那我桌上的热咖啡跟炖菜哪来的？',
        },
        signpostHint: '[审计提示：请拿起工位上的【陶瓷马克杯】、【铝制便当盒】、【磨砂玻璃】与【拍立得照片】逐一核对。]',
      },

      /* ----------------------------------------------------------------------
       * 档案 #05：阶段三引爆点（干瘪冷酷的市政封存清册，收束全部旧磁带缓存伏笔）
       * ---------------------------------------------------------------------- */
      file05: {
        title: '档案 #05｜市政地下档案库 B 区永久封存及资产核销清册',
        metadata: '编号: B-SEC-DECOM-09 | 签发: 市政资产处置处 | 状态: 永久闭库',
        paragraphs: [
          '一、封存事由：因主干道沉降导致地下 B 区北墙持续渗水、顶板剥落，经工程中心鉴定，该层已不具备安全办公条件。',
          '二、闭库时间：地下 B 区已于三年前（11 月 14 日 18:00）切断市政水电暖气，焊死东侧铁门，原编制全部调离至一楼与新馆。',
          '三、现场清理：闭库前已拆走走廊投币机、茶水间电器及 2 号升降井马达。地下室常年恒温 11℃，无照明与供暖。',
          '四、资产报废（12–15 项）：#302 号胡桃木贴皮桌、#209 号磨砂玻璃隔断（拆除预备期已震裂）、3 号双门铁皮柜就地封存报废。',
          '五、旧表单说明：队列中出现的一楼餐单调整、禁暖脚器、E-11 寻红订书机等公告，均系三年前闭库前留存于本地磁带缓存的残片。',
          '六、失联结案：原待调员工 #209（Arthur）与保洁员 C-14（林）三年前清场夜最后出现于 3 号铁皮柜旁，此后失联并已挂账封存。',
        ],
        target1: {
          id: 'f5_target1',
          violationTag: '终端冲突核心（点击确认并核销）',
          text: '七、遥测异常：尽管 B 区线路已切断 1,095 天，炭灰监视器 TCD-302 每夜 23:00 仍自行启动，持续向 3 号柜索引写入“四口之家名单”。',
          innerVoice: '头顶的白灯灭了……那些红蓝黄的彩灯是从哪儿转出来的？',
        },
      },
    },
  },

  en: {
    /* ========================================================================
     * [ITEM 2] OPENING GROUNDING, MUNDANE BANTER POOL & OPERATIONS MANUAL
     * ======================================================================== */
    asset1: {
      openingBadge: 'TCD PRE-SHIFT PROTOCOL // TERMINAL #302',
      groundingPrompt:
        '[VISUAL & FOCUS CHECK]: Hold gaze on the personal photograph beside your monitor for 5 seconds before sign-in.',
      groundingCountdown: (sec: number) => `Gaze calibration: ${sec}s`,
      groundingComplete: 'Calibration passed. Focus and pulse nominal.',
      openingMonologue: 'Same HR eye check. Five, four, three, two, one. Family looks fine. Back to work.',
      loginButton: '[SIGN IN TO TCD-302 TERMINAL]',

      systemWakeUp:
        '>>> TCD-302 MONOCHROME CRT ONLINE | SHIFT: NIGHT (23:00–07:00) | QUEUE: 5 FILES | TEMP: 19°C',
      wakeUpInnerVoice: "Arthur took the night off. Coffee's still warm, though. Better check the manual first.",

      randomIdleBanter: [
        'After municipal tax, the night stipend barely buys two extra tins of ham.',
        'Pantry instant chicory coffee tastes like dishwater. Glad I brought my own.',
        'Hope 1F still has barley soup tonight. Ten minutes late means dry rye.',
        'Every time this chair cylinder drops an inch, I expect the spring to snap.',
        'Mina at E-11 borrowed my red stapler last Tuesday and vanished with it.',
        'That damp stain on ceiling tile four looks like a crooked goose.',
        'Must be nice having Keller’s east window desk upstairs, even with tram noise.',
        'Night shifts beat squeezing onto morning trams smelling wet wool coats.',
        'These new blue Admin ballpoints leak an ink blob every five words.',
        'First thing on payday is settling two overdue utility slips with my landlord.',
        'Heard 3F microfilm clerks get year-end bonuses. Doubt this basement counts.',
        'Left wool sock keeps slipping under my heel. Drives me crazy.',
      ],

      manualTitle: 'Standard Redaction & Filing Manual',
      manualSubtitle: 'Sub-Municipal Archive Annex · Sector B Night Clerk Edition (Rev. 4)',
      manualPreface:
        'PREFACE: This annex handles tape entry and redaction for municipal utilities, logistics, and legacy dossiers. Keep entries neutral. Do not tear pages, fold coasters, or rest soup bowls on the cover.',
      manualAppendixTips: [
        'APPENDIX A (SUPPLIES): Submit carbon Form M-12 at the 1F dispatch window before swapping ribbons or toner. Never pry open waste hoppers.',
        'APPENDIX B (PANTRY): Never heat foil-sealed tins inside the electric oven. Rinse dark rings out of ceramic mugs before leaving.',
        'APPENDIX C (OUTLETS): Sub-level winters run damp, yet coil foot warmers over 300W are barred. Violations cost half a shift credit.',
        'APPENDIX D (CONDUCT): Personal thermoses are allowed; pushing chairs together to sleep is barred. Log flickering tubes instead of climbing desks.',
      ],
      manualFooterNote: '"Keep the desk clear. Keep the record continuous. Have a productive shift."',

      rules: [
        {
          id: 'RULE 01 // NEUTRAL PHRASING',
          title: 'Strip Subjective Complaints & Guesses',
          text: 'Archived logs must use neutral administrative phrasing. Redact personal gripes and unverified noise guesses (e.g., "sounds like knocking on sheet metal"), then apply the stamp.',
          lateAnnotation:
            'Ballpoint note: Never log "fingernails" or "chewing pulp." Normalize to "west sump pump thermal knock."',
        },
        {
          id: 'RULE 02 // ATTENDANCE CONSISTENCY',
          title: 'Exclude Unverified Staffing Rumors',
          text: 'Presence and leave follow master punch-card totals only. Redact any log speculating on coworkers’ whereabouts or "missing staff."',
          lateAnnotation:
            'Ballpoint note: C-14 and #209 are not missing. Both are filed in Cabinet #3. Count present.',
        },
        {
          id: 'RULE 03 // QUERY ISOLATION',
          title: 'Respect Clearance Boundaries',
          text: 'Process assigned queue items only. Never cross-check your Workstation ID (#302) against sealed legacy microfilm reels.',
          lateAnnotation:
            'Ballpoint note: Day 1,095. Do not peel the tape off the bezel photo. The glue has fused to the paint.',
        },
      ],
    },

    /* ========================================================================
     * [ITEM 3] FIVE CORE DOSSIERS (#01–#05) + RETROSPECTIVE FILE #01
     * ======================================================================== */
    asset2_dossiers: {
      /* ----------------------------------------------------------------------
       * FILE #01: Phase 1 (Breezy, grounded 1980s night-janitor handover book)
       * ---------------------------------------------------------------------- */
      file01: {
        title: 'File #01 // Sector B Night Janitorial & Floor Log',
        metadata: 'DOC ID: TCD-LOG-B1114 | SHIFT: NIGHT (22:30–02:00) | FILED BY: UNIT C-14 (LIN)',
        preamble: 'NOTE: Transcribed from handwritten binder. Redact casual or unverified lines per Manual Rules 01–02.',
        entries: [
          {
            kind: 'normal',
            id: 'f1_n1',
            text: '22:35 — Punched the 1F timeclock and rode Lift #2 down to Sector B. West baseboard is weeping damp again; mopped twice and set the yellow cone.',
          },
          {
            kind: 'normal',
            id: 'f1_n2',
            text: '22:48 — Found half a cold meat pie in wax paper stuffed on top of the west fire-hose box. Ants everywhere. Bagged it.',
          },
          {
            kind: 'normal',
            id: 'f1_n3',
            text: '23:02 — Dropped three coins in the lounge dispenser for hot broth. Machine rattled ten seconds and spat out two stale peppermints. Robbed again.',
          },
          {
            kind: 'normal',
            id: 'f1_n4',
            text: '23:12 — Cleared tea leaves out of the pantry drain with wire. Note for morning shift: the hotplate socket is dead, so heat tins upstairs on 1F.',
          },
          {
            kind: 'normal',
            id: 'f1_n5',
            text: '23:20 — Tidied old Municipal Bulletins on the corner rack. Last month’s copies are all curled from spilled cold water.',
          },
          {
            kind: 'target',
            data: {
              id: 'f1_target1',
              violationTag: 'Rule 01 (Casual Personal Complaint)',
              text: '23:28 — Emptied Desk #302’s bin. Packed tight with balled scrap paper, plus half a brown apple core left on the edge. Going to draw rats.',
              innerVoice: 'Lin called out my desk. Too casual for the log—black it out.',
            },
          },
          {
            kind: 'normal',
            id: 'f1_n6',
            text: '23:36 — Washroom stall two pull-cord sticks unless tugged twice. Zhang swapped the bulb last month; writing a carbon repair slip tomorrow.',
          },
          {
            kind: 'normal',
            id: 'f1_n7',
            text: '23:44 — Picked up half a blue pen refill and a note by the breaker reading "D-08 Keller took Wrench #3." Put it back in the tray.',
          },
          {
            kind: 'target',
            data: {
              id: 'f1_target2',
              violationTag: 'Rule 02 (Unverified Staffing Speculation)',
              text: '23:52 — Passing #209’s glass, heard kraft folders rustling near Cabinet #3 and figured Arthur came back to pack. Peeked in—nobody there. Guess he left.',
              innerVoice: 'Arthur probably went upstairs for keys. Unchecked whereabouts go under Rule 02.',
            },
          },
          {
            kind: 'normal',
            id: 'f1_n8',
            text: '00:08 — East exhaust fan sounded slightly deeper tonight, like humming through cotton, though airflow feels normal and housing is cool.',
          },
          {
            kind: 'normal',
            id: 'f1_n9',
            text: '00:24 — Emptied waste baskets from all five cubicles into the cart. Two full bags, mostly misprinted duplex forms.',
          },
          {
            kind: 'normal',
            id: 'f1_n10',
            text: '00:40 — Hauled bags to 1F compactor and soaked the mop in bleach. Quiet night overall, just airless downstairs. Handover normal.',
          },
        ],

        alteredRetrospective: {
          metadata: 'DOC ID: DIGESTION-LOG-302 | STAMP PEELED: [NORMALIZED] -> [PHYSICALLY STAPLED]',
          recoveredLines: [
            '23:28 — [ORIGINAL UNDER REDACTION]: "No bin under Desk #302. He is tearing red-inked scrap strips, chewing them with clipped nails, and telling an empty wall the stew smells good."',
            '23:52 — [ORIGINAL UNDER REDACTION]: "Half a chewed cotton lanyard is pinched in Cabinet #3’s door gap with Arthur’s #209 badge on it. Latch is shut from inside; knuckles keep rapping the steel."',
          ],
          systemNote:
            'RETROSPECTIVE AUDIT: Operator #302 purged both eyewitness lines in Phase 1. C-14 badge is now double-stapled to Case M-04.',
        },
      },

      /* ----------------------------------------------------------------------
       * FILE #02: Phase 1 (11 crisp corporate bullets — light, scannable, 90% fluff)
       * ---------------------------------------------------------------------- */
      file02: {
        title: 'File #02 // Weekly Annex Operations & Admin Bulletin',
        metadata: 'DOC ID: SEC-209-A | ISSUED: NOV 13 | DISTRIBUTION: INTERNAL',
        memoHeader: 'COPIES TO: 1F Sector A Lobby, Sub-Level Sector B, Facilities, Payroll',
        sections: [
          '1. [SUMP PUMPS]: West Sump Pump #2 ran a 45-minute Tuesday drain cycle at 0.38 MPa with zero flange seepage.',
          '2. [COIL HEATERS BARRED]: Unapproved coil foot warmers tripped Sector B Breaker #3 repeatedly. One plaid warmer belonging to D-08 (Keller) was confiscated.',
          '3. [1F CANTEEN MENU]: Due to grain supplier delays, hot broth and barley porridge are paused after 22:30. Night chits exchange for rye bread, pickled radish, and weak tea.',
          '4. [COIN DISPENSER]: Regarding the lounge broth machine swallowing coins and dropping stale mints, vendor service is booked for month-end. Stop slapping the glass.',
          '5. [LOST & FOUND]: Clerk E-11 (Mina, Desk A-04) lost a red metal stapler with a round yellow smiley sticker and half a box of No. 12 staples. Return by Friday.',
          '6. [PRINT RIBBONS]: Sector A Copier #2 is at 15% toner. Avoid overnight 50-page duplex runs.',
          '7. [TAX WITHHOLDING]: Night meal chits now roll into base payroll tax. Check punch-slips on payday instead of dialing Payroll ext. 204.',
          '8. [STAFFING TRANSFER]: Sector B Archivist #209 (Arthur) requested daytime reassignment due to chronic insomnia. Effective Nov 13, his Sector B roster is suspended.',
          '9. [PERFORMANCE]: Archivist #302 cleared 14 backlog folders this week with 100% redaction accuracy and zero unauthorized queries.',
          '10. [STAIRWELL]: Empty cartons and buckets on Fire Stair #3 will be hauled out Sunday 09:00. Claim personal items beforehand.',
          '11. [CLOSING]: Switch off desk lamps and latch steel cabinets before leaving to keep damp from curling paper stock.',
        ],
        innerVoice: 'Keller lost his foot warmer. And Arthur moved to 3F on the 13th—explains the quiet.',
      },

      /* ----------------------------------------------------------------------
       * FILE #03: Phase 2 (Arthur's draft — crisp, relatable tired coworker)
       * ---------------------------------------------------------------------- */
      file03: {
        title: 'File #03 // Unfiled Draft (#209)',
        stageA: {
          metadata: 'DOC ID: DRAFT-209-TMP | AUTHOR: ARTHUR | STATUS: LOCKED (COMPLETE #01 FIRST)',
          paragraphs: [
            'Draft (local only): If my upstairs radiator bangs like a hammer one more afternoon, I am losing my mind.',
            'Missed 1F soup again—nothing left but dry rye. Fed three coins into the Sector B machine and it ██ ate them without dropping ██.',
            'Quick note: hunting for glue in Cabinet #2 today, I saw #302’s intake sheet. Front half looks like ███ clinic pages glued to ███.',
            'Also saw the "family photo" taped to his monitor. Under the tape it is an old ███ flyer.',
          ],
          systemLock: '[SYSTEM LOCK: Complete routine redactions in File #01 to synchronize clearance.]',
        },
        stageB: {
          metadata: 'DOC ID: DRAFT-209-TMP | AUTHOR: ARTHUR | SAVED: NOV 14, 01:48',
          paragraphs: [
            'Draft (handing to HR tomorrow): Three weeks of graveyard shifts and my upstairs cast-iron radiator still hammers all afternoon while trams screech past outside. Miscounted the same voucher stack three times tonight.',
            'Missed 1F kitchen cutoff again—only dry rye bread left. Dropped three coins into the Sector B machine for hot broth and it swallowed them without even dropping mints. Nothing down here smells like anything except damp plaster and lemon bleach.',
            'Writing down one odd bit, probably sleep loss: digging for paste in Supply Cabinet #2, I slid out a thin binder labeled #302. Front half is a psychiatric follow-up sheet with the clinic header sliced off, glued to a blank storm-drain inspection form. No hire date.',
            'Also, Sector B’s pantry hotplate has been dead since Keller’s warmer tripped Breaker #3 last week. Yet walking past #302’s frosted glass always smells like rich beef stew. Peeked around once and saw him spooning wet gray mash into his mouth—probably soaked rye crusts.',
            'Worse is that Polaroid taped to his monitor bezel. Two nights ago he held it up and asked why I never come home for dinner. Under the yellowed tape is a three-year-old missing-child notice (Case M-04) taped flush beside a clipped photocopy of C-14’s badge.',
            'I started to ask if overtime was getting to him, and he looked right past my shoulder at the concrete wall, nodded gently, and said his wife and daughter were waiting inside Cabinet #3.',
          ],
          target1: {
            id: 'f3_target1',
            violationTag: 'Rule 03 (Unauthorized HR Folder Check)',
            text: '02:11 — Stopping before I sound crazy myself. Switched off my monochrome CRT to rub my eyes just now, and in the dark glass reflection someone stood behind my chair holding a red stapler with a yellow smiley sticker—probably just Keller checking meters.',
            innerVoice: "Arthur's burnt out. Black out that line before HR flags his transfer.",
          },
          bleedThrough: {
            header: '[INK UNSET // UNDERLAYER STILL: CCTV_SectorB.png · 02:14]',
            caption: 'SURVEILLANCE FRAME: Sector B corridor empty and dark. Steel Cabinet #3 ajar two inches; frayed blue badge cord pinched in lower rail.',
            innerVoice: 'Ribbon ink leaking? Wait—why is a 02:14 CCTV still behind his draft?',
          },
        },
      },

      /* ----------------------------------------------------------------------
       * FILE #04: Phase 2 (12 clean, dry utility & mechanical timeclock rows)
       * ---------------------------------------------------------------------- */
      file04: {
        title: 'File #04 // Sector B 11-Day Utility, Supply & Timeclock Audit',
        metadata: 'DOC ID: FAC-B-409 | PERIOD: NOV 06 – NOV 17 | FACILITIES AUDIT',
        intro: 'NOTE: Mechanical meter, supply chit, and punch-clock totals. Cross-check against physical desk items.',
        rows: [
          '01. [DRAINAGE]: West Sump Pump #2 ran 18.4 hours (41.2 kWh); check valve nominal.',
          '02. [FIRE SAFETY]: Four corridor dry-chemical canisters in green pressure zone; lead seals intact.',
          '03. [LIGHTING]: 12 T8 tubes in storeroom; last draw by D-08 (Keller) for 1F east hall.',
          '04. [PANTRY BREAKER]: Sector B brewer and hotplate sealed offline since Nov 06 ground-fault trip (Day 11; 0.00 kWh).',
          '05. [1F MEAL CHITS]: Nov 13–17 redemptions: D-08 (4), E-11 (3), Gate (5). Desk #302 redemptions: [0].',
          '06. [STATIONERY]: 1F issued 6 boxes of No. 12 staples (1 replacement box to E-11 Mina), 4 typewriter ribbons, 150 kraft folders.',
          '07. [FOOD / FREIGHT LIFT]: Lift #2 locked out for frayed hoist cable servicing; stair access only.',
          '08. [SILICA TUBS]: Replaced 4 corridor moisture tubs; unit beside Cabinet #3 saturated early.',
          '09. [TIMECLOCK — C-14 LIN]: Punched in Sector B Nov 14, 22:58. Punch-out within 72h: [NONE].',
          '10. [TIMECLOCK — #209 ARTHUR]: Punched out Nov 13, 07:12. Subsequent basement or 3F punches through Nov 17: [NONE].',
          '11. [TIMECLOCK — D-08 / E-11]: Punches restricted to 1F Sector A and 3F; zero sub-level activity.',
          '12. [COLD CASE — M-04]: Three-year-old folder missing 1-inch ID photo; razor trim notch measures 2.1cm × 2.8cm.',
        ],
        target1: {
          id: 'f4_target1',
          violationTag: 'Audit Discrepancy (Inspect Desk Props)',
          text: '13. [UNRESOLVED FLAG]: Despite 11 days offline, locked lift, and zero meal chits, Desk #302 logs daily "hot coffee" and "warm stew lunchbox." Verify desk items.',
          innerVoice: 'Hotplate dead and lift locked? Then where did my warm mug and stew come from?',
        },
        signpostHint: '[AUDIT TIP: Pick up and inspect your Mug, Lunchbox, Partition Glass, and Polaroid.]',
      },

      /* ----------------------------------------------------------------------
       * FILE #05: Phase 3 Core Trigger (Dry municipal decommissioning ledger)
       * ---------------------------------------------------------------------- */
      file05: {
        title: 'File #05 // Sector B Permanent Seal & Asset Disposal Ledger',
        metadata: 'DOC ID: B-SEC-DECOM-09 | MUNICIPAL ASSET DISPOSAL | STATUS: SEALED',
        paragraphs: [
          '1. CLOSURE REASON: Road subsidence caused chronic seepage and ceiling delamination along Sector B’s north wall. Engineering declared the level unsafe.',
          '2. SEAL DATE: Sector B was permanently cut from water, mains power, and heating three years ago (Nov 14, 18:00). Stairwell doors were welded shut; staff moved to 1F and the new annex.',
          '3. SITE CONDITION: Coin dispensers, pantry hotplates, and Lift #2 drive motors were stripped prior to welding. Ambient temperature sits at 11°C year-round.',
          '4. WRITTEN-OFF ASSETS (ITEMS 12–15): Walnut Desk #302, frosted partition #209 (cracked during prep), and Steel Cabinet #3 were written off in place.',
          '5. TAPE CACHE NOTE: Routine bulletins surfacing locally (coil warmer bans, canteen rye changes, E-11’s lost red stapler) are three-year-old pre-closure magnetic tape fragments.',
          '6. MISSING STAFF: Reassigned clerk #209 (Arthur) and cleaner C-14 (Lin) were last seen near Cabinet #3 on clearance night three years ago. Both closed as lost.',
        ],
        target1: {
          id: 'f5_target1',
          violationTag: 'Telemetry Conflict (Verify & Clear)',
          text: '7. TELEMETRY FAULT: Though lines to Sector B were severed 1,095 days ago, monochrome CRT TCD-302 still boots nightly at 23:00, writing a "Four-Person Family Roster" into Cabinet #3.',
          innerVoice: 'Overhead bulb just died. Where are those red, blue, and amber lights coming from?',
        },
      },
    },
  },
};
