# MAD4033: The Correction Department（《更正部 / TCD》）— 正式版 Storyboard、完整叙事设定与开发方针圣经 (Frozen v1.0)

- **课程：** MAD4033 Interactive Narrative & Experience Design | **导师：** Hannah
- **小组成员：** 成员 A / 成员 B（分工待共同认领）
- **展示目标：** 下周三课堂展示（正式版 Experience Storyboard + 可交互网页 Prototype + 设计演变阐述）

> **整合说明（Integration Note - v1.0 Frozen）：**  
> 本文档已冻结为最终执行版本（Frozen v1.0），全面整合了前期 FigJam 头脑风暴草案、Week 5 & Week 8 课程考核标准、Plan B 桌面自由探索交互模型、三层开发优先级控制矩阵（3-Tier Scope Matrix），以及针对叙事悬念与状态机防呆的四大核心升级（**开场 5 秒体制化情绪锚定钩子**、**File #03 渐进显影机制**、**双结局镜像唯我论结构**、**`Set<string>` 幂等状态机锁**）。  
> 本文档作为项目唯一事实来源（Single Source of Truth），供团队成员及自主编码 AI（Antigravity IDE / AI Studio Playground / Codex）直接读取并执行。

---

## 第一部分：叙事设定分层总览（【设想骨架】 vs. 【完全设想】）

### 1.1 【设想骨架】（团队前期 FigJam 共识基底）

- **基础前提（Basic Premise）：** 玩家扮演《更正部（The Correction Department, 简称 TCD）》的档案文员，日常工作是核对文件、修正矛盾并抹除违规记录。主角接手了前任调查员（因“精神不稳定”而失联）遗留的未结案卷。
- **核心叙事假设（双结局镜像互补 · 绝对不可分辨）：** 主角在故事开始前就已受到某种未知影响。全篇不设“官方唯一真相”，而是通过 **Branch A 与 Branch B 的镜像互补** 维持 50/50 的唯我论死循环：
  - **Interpretation A（心理学/精神创伤解释 —— 对应 Branch A 体验）：** 主角的记忆、感知与认知高度不可靠，所谓的“档案异变”与“怪物”均是重度解离性精神崩溃与罪恶感催生的幻觉滤镜；开场的怪异语言是高压官僚体制洗脑下的心理防御。
  - **Interpretation B（超自然/宇宙恐怖解释 —— 对应 Branch B 体验）：** 档案馆内确实存在某种认知污染或逆模因实体，正在通过文字、记录与界面吞噬并改写现实，而所谓的“临床精神病诊断”只是部门用来掩盖异常的官僚借口。
- **核心体验目标：** **戏剧反讽（Dramatic Irony）+ 回溯性恐怖（Retrospective Horror）**——玩家从第一秒的“5秒注视照片倒计时”察觉到体制化的诡异感，在初期按章办事亲手涂黑求救信号，最终在第三幕回溯揭示中体会到“亲手帮它抹平证据”的毛骨悚然。
- **核心分支结构：** `Entry → Discovery → Choice → Feedback → Consequence → Ending`，围绕 **Branch A（Erase / Contain：抹除异常、维持表面日常）** 与 **Branch B（Preserve / Reconstruct：保留矛盾、重构深渊母体）** 展开。

### 1.2 【完全设想】（完整世界观、人物设定与四幕详尽剧情）

#### A. 核心审美与日常伪装机制（Mundane Camouflage & Sensory Decoys）
- **风格融合：** 宇宙恐怖（Cosmic Horror）× 规则怪谈 × 早期模拟恐怖/伪人档案（Analog Horror）× DDLC 式认知滤镜崩坏。
- **日常伪装与高薪假象：** 档案馆对外呈现为“高薪、低工作量、包吃包住、终身保障”的地下市政档案外包基地。这种极度舒适的日常假象与冰冷的官僚机器形成鲜明对比。
- **桌面生活细节交互物：** 主角桌面上摆放着半开的铝制便当盒、带深色咖啡渍的马克杯、起雾的隔断玻璃，强化“日常办公”的沉浸感，并在第三幕滤镜破碎后发生让人脊背发凉的认知变脸。
- **双重含义音效拟真（Sensory Decoys - Tier 3 扩展）：** 利用环境音效制造双重解释的模糊感——11月雨季管道滴水声遮蔽肉体咀嚼声；咖啡机运转与加热咕噜声遮蔽气管血泡声；通风扇嗡鸣遮蔽金属撕裂与切割声。

#### B. 核心角色与“伪人家庭填空题”设定
1. **主角（工号 302 — 当前终端操作员）：**
   - **表层自我认知：** 一名兢兢业业、严格遵守《员工心理健康手册》、热爱家庭、关心同事的更正部老员工。觉得自己“生来就在这里工作”，把脑海里时常响起的非人嗡鸣与操作指令当作“熟能生巧的职业本能（Muscle Memory）”。
   - **深层真相（兼容双重解释）：**
     - *若按超自然解释：* 它可能并非真正的人类，而是从地下档案馆海量被涂黑、被销毁的废旧记录与死者执念中诞生的一种**“认知异常/信息寄生体”**。因为它吸收了《员工心理健康手册》，试图模仿“一个正常人类员工应当拥有妻子、女儿和挚友”的概念，于是像做连线填空题一样，将视野里的活人强行套进模板，并用物理/认知同化的方式实现了所谓的“一家团聚”。
     - *若按心理学解释：* 他是一名长期被困在高压地下档案室、彻底精神解离的孤独文员（302号）。为了在非人的官僚机器中活下去，他靠机械背诵《心理健康手册》来维持理智，将走廊里的女清洁工妄想成妻子，将旧案卷传单上的失踪女孩妄想成女儿；当前辈好友 Arthur 发现他收集死人照片并试图干预时，他在精神失控中制造了惨剧，随后大脑自动启动防御滤镜，将一切合理化为“正常的日常办公”。
2. **“挚友 / 前任调查员” Arthur（工号 209）：**
   - **主角眼中的他：** 坐在隔壁工位、每天一起喝咖啡聊天的好朋友兼前辈，今天不知为何突然休假，留下了未完成的案卷。
   - **实际上的他：** 察觉到 302 号工位（主角）行为极度反常、深夜在档案室收集失踪人口与死者照片并对着空气扮演“一家三口”的同事。他在私人手记中混乱地记录着对 302 号与自身精神状态的怀疑，并在试图干预 302 号时突然在 B 区夜班中失联。
3. **“妻子”（B 区夜班女清洁工 — 林氏，工号 C-14）：**
   - 每天深夜推着清洁车经过 302 号工位走廊的沉默女工。主角因为每天看到她，便照着手册里“妻子会在夜晚陪伴丈夫”的词条，单方面认定她是自己的妻子。
4. **“女儿”（旧案卷编号 M-04 的走失女童）：**
   - 三年前一份未结失踪人口档案袋上的黑白照片女孩。主角把她的头像剪下来，贴在了自己的工牌旁边。

#### C. 完整四幕剧情详述（Plan B 桌面自由探索 + 渐进显影 + 分阶段【申请离职】机制）
- **第一幕：五秒钟的“情绪锚定”与日常桌面探索（Act I: Five Seconds of Grounding）**
  - **开场钩子（体制化怪诞感）：** 画面亮起，玩家看到主角拿着模糊的“全家福”照片（证物 #1）。主角照着《员工心理健康手册》第 4 节的规定，对着照片机械倒数 5 秒以完成班前“情绪锚定”，随后平静地汇报“我现在感到温暖了”，登入终端进入 Plan B 自由探索桌面。
  - **Plan B 桌面自由探索布局：** 左侧为《部门标准操作手册》，中央为待办档案（`File #01`、`File #02`、`File #03`）与 3 个生活道具（便当盒、马克杯、起雾玻璃），底部为常驻的 `[APPLY FOR RESIGNATION / SELF-TERMINATION]`（申请离职 / 自我注销）按钮（带 `0/3` 配额进度条）。
  - **File #03 的“渐进显影（Progressive Decryption）”机制：**
    - 在 `0/3` 初始阶段，`File #03` **并非死锁不可点**，而是点开后呈现为一份被系统打满乱码与黑块的《#209 号员工未归档草稿（认知同步率不足）》，仅露出零星刺眼词汇（如 `Desk #302`、`missing child flyer`、`standing behind me`），底部提示：`[SECURITY LOCK: Complete at least 1 routine normalization in File #01 to synchronize cognitive clearance]`。
    - 当玩家在 `File #01` 中完成**第 1 处涂黑**（`quotaCount >= 1`）后，`File #03` 的乱码自动褪去，显影出 Arthur 完整的私人手记！
  - **3 阶段随机洗脑语料库（0/3 → 3/3 进度）：** 玩家在 `0/3`、`1/3`、`2/3` 阶段点击离职按钮时，系统不会生硬报错，而是随机弹出主角自我安抚与体制化洗脑的独白（从贪恋补贴奖金，逐渐滑向“纸张贴在皮肤上”、“必须压紧抽屉”的粘稠语意）。

- **第二幕：挚友的手记与渗血的油墨（Act II: Contradiction Between the Lines）**
  - **双文档对比调查：** 玩家完成 `File #01` 的两处涂黑（抹除清洁工林氏记录的“302对着白纸叫亲爱的”与“3号柜伸出太多关节的手”），并在 `File #03` 显影后，将 `File #02`《官方监控报告》与 `File #03`《Arthur 的私人手记》并排比对。
  - **矛盾浮现：**
    - `File #02` 冰冷地记录着：*“昨晚 B 区无任何异常，#209 档案员 Arthur 因急性被害妄想主动申请调离，#302 工位全程正常运作。”*
    - `File #03` 却是 Arthur 充满恐惧与自我怀疑的绝笔：记录了 #302 的人事档案像是由碎纸拼凑而成、将失踪女童传单与清洁工胸牌贴在一起当全家福，以及昨晚 #302 站在他身后问他“为什么不回家吃饭”。
  - **异常交互（Erase to Reveal）：** 系统弹出警告要求涂黑 `File #03` 末尾的矛盾指控。当玩家点击涂黑时，黑墨像融化的沥青一样向下渗开，浮现出暗红色的隐藏图层与监控快照（**静态证物图 #2：B区深夜监控异常截图**），配额正式达到 `3/3`。

- **第三幕：回溯性崩塌、自我注销受阻与“团聚”真相（Act III: The Hollow Reunion）**
  - **触发离职申请与滤镜破裂：** 当涂黑配额达到 `3/3` 时，底部的离职按钮变为亮绿色高频脉冲状态。玩家点击按钮试图逃离/注销自我，界面弹出 Spinner 加载动画与刺耳电子音，随后弹出主角恍然大悟的拒绝独白：*“等等……我为什么要提交这个？我的妻子、女儿和 Arthur 全都在 3 号档案柜里啊。我所爱的一切都在这个房间里，我没有任何理由离开。”*
  - **全桌面道具“变脸”与强制回溯：** `lensBroken` 状态置为 `true`。桌面上所有生活道具瞬间展露恐怖真相（便当盒里是被咀嚼的废纸与弯曲订书钉、马克杯底沉着染血工牌、起雾玻璃外是废弃三年的空旷地下室）。同时系统强制弹出真相版 `File #01` 与真实全家福（**静态证物图 #3：订书机钉死的三张血迹证件与传单**）。
  - **毛骨悚然的“幸福感”：** 主角彻底卸下伪装或防线，沉浸在“一家四口终于融成同一份档案”的空洞幸福感中。

- **第四幕：核心抉择与双结局镜像唯我论（Act IV: Two Ways to Keep the Record）**
  - 玩家在复核完变异的 `File #01` 与真实全家福后，点击窗口底部的 **`[PROCEED TO FINAL ARCHIVE PROTOCOL]`（进入最终归档裁决协议）** 按钮，在两个互为镜像的结局中做出不可逆选择：
  - **【Branch A — ERASE / CONTAIN（抹除异常 / 维持心理防御）】→ 结局 A：《The Perfect Record（完美记录）》**
    - **主动涂黑机制与心理学悲剧体验：** 屏幕列出 3 条冰冷的临床诊断与行政真相记录（“#302 确诊重度解离性精神病”、“B区已于3年前坍塌废弃”、“#209 与 C-14 失踪前最后出现在 #302 工位”）。玩家必须**亲手逐行点击涂黑这 3 条真相**。每涂黑一行，刺耳的背景噪点与红光就消退一分，界面逐步退回温暖安全的暗绿色 CRT 滤镜。
    - **终局余韵：** 照片变回模糊的温馨全家福，主角伸了个懒腰抱怨今天错别字真多，随后好奇“隔壁 209 号空工位以前坐着谁来着？”，系统叮的一声派发新的 `LOG-B-1115`。玩家亲手帮主角锁死了“普通人类社畜”的幸福幻觉循环。
  - **【Branch B — PRESERVE / RECONSTRUCT（保留矛盾 / 重构深渊母体）】→ 结局 B：《The Last Witness（最后的见证）》**
    - **界面剥落与宇宙恐怖体验：** 玩家拒绝涂黑，点击保留并重构全部异常记录。日常办公 UI 的表皮彻底剥落，露出底下由暗色有机纤维、碎纸片与重叠人名交织而成的深渊母体终端。
    - **终局余韵：** 所有的残缺碎片被归并为《家庭成员归并报告》。主角温柔地向屏幕外的玩家发出邀请：*“爸爸、妈妈、女儿，还有最好的朋友 Arthur——我们终于印在同一页纸上了。档案柜里好暖和啊。屏幕那头的同事……你也想让我把你的名字钉在我们的全家福上吗？”* 屏幕定格在 `STATUS: AWAITING NEW ARCHIVIST`。
    - **双结局镜像留白：** 不在结局 B 强行塞入上帝视角的客观辟谣，而是让 **Ending A（彻底的心理创伤防御）** 与 **Ending B（彻底的逆模因吞噬同化）** 互为镜像——玩家只有打通两个结局，才会在“到底哪个才是底色”的唯我论漩涡中细思极恐。

---

## 第二部分：正式版体验分镜表（Experience Storyboard）

*严格对齐 Week 5 & Week 8 课件要求：聚焦 **Sees/Knows → Audience Action → System Response → Consequence & Emotional Arc**，按四步结构展开。*

| 阶段 (Stage) | 玩家看到/知道什么 (Sees / Knows) | 玩家操作 (Audience Action) | 系统反馈 (System Response) | 叙事后果与情绪弧线 (Consequence & Emotional Arc) | 界面与静态证物备注 (UI & Visual Notes) | 对应前期研究 (Crazy 8s / 亲和图) | 负责人 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **01 ENTER**<br>5秒情绪锚定、桌面探索与初次涂黑 | **【骨架】** 看到《操作手册》与日常档案 File #01，接手失联前任的工作。<br>**【细化】** 开场对着全家福（证物#1）按手册倒数5秒完成“情绪锚定”；进入桌面自由查看便当盒/马克杯/隔断玻璃、File #01、File #02 及乱码状态的 File #03；底部常驻 `0/3` 离职按钮。 | **动词：Inspect / Redact / Test Resign**<br>查阅照片与手册；点击桌面道具；点开乱码 File #03 查看提示；用鼠标涂黑 File #01 的 2 处违规语句；试着点击离职按钮。 | 涂黑处显示 `RECORD NORMALIZED` 绿章；完成第 1 处涂黑时，File #03 乱码褪去完成显影；点击离职按钮弹出 Stage 0/1 洗脑独白。 | **后果：** 玩家从开场5秒倒数察觉体制化诡异感，但在日常氛围中亲手抹除求救信号。<br>**情绪弧线：** 微妙违和（Uncanny Hook）→ 平静的掌控感（Routine Control）。 | 暗绿 CRT 桌面，整合 File 列表、桌面道具卡片、证物 #1，以及底部 `0/3` 离职按钮。 | **Group B：** 制度与程序决策<br>Crazy 8s: U16 The Routine, T05 Classify the Case | 成员 B |
| **02 DISCOVER**<br>手记显影、矛盾对比与墨迹渗出 | **【骨架】** 并排对比前任遗留的两份矛盾档案（File #02 & #03），发现异常。<br>**【细化】** 阅读显影后的《Arthur 私人手记》并与《官方监控报告》双栏对比；发现 Arthur 记录了 #302 将失踪女童传单与清洁工胸牌拼成全家福；当前配额 `2/3`。 | **动词：Compare / Erase to Reveal**<br>开启双文档对比视图；点击涂黑 Arthur 手记末尾的矛盾指控；试点 `2/3` 离职按钮。 | **关键异变：** 涂改黑条向下渗开，浮现暗红隐藏字迹与证物 #2（监控截图）；配额达 `3/3`，离职按钮变为高亮绿色脉冲。 | **后果：** 确认主角（#302）认知严重异化；离职按钮亮起，诱发玩家立刻点击逃离。<br>**情绪弧线：** 怀疑（Uncertain）→ 震惊与不安（Unease & Dread）。 | 双栏对比视图；墨迹渗出动画；展示证物 #2；离职按钮高亮脉冲。 | **Group A & D：** 证据调查 / 感知与界面<br>Crazy 8s: T04 Compare Evidence, T01 Erase to Reveal, U11 Hidden Connections | 成员 A |
| **03 DECIDE**<br>离职受阻、全桌面变脸与最终裁决 | **【骨架】** 复核早期档案触发回溯性恐怖，面对系统弹出的二选一最终处理协议。<br>**【细化】** 点击 `3/3` 高亮离职按钮触发 Spinner 加载与拒绝独白；全桌面道具切换为腐败/血迹描述；弹出真相版 File #01 与证物 #3，底部出现进入最终裁决按钮。 | **动词：Re-examine / Decide**<br>1. 点击 `3/3` 离职按钮（触发滤镜破碎）；<br>2. 复核变脸后的桌面道具与变异 File #01；<br>3. 点击进入最终协议，选择 Branch A 或 B。 | 界面转为暗红/深黑高对比压迫色调；道具与档案全面变脸；点击确认后展示 Branch A / B 最终裁决大按钮。 | **后果：** 体验极度回溯性恐怖，明白第一幕的涂黑实为抹杀活人记录，做出最终抉择。<br>**情绪弧线：** 挣扎（Hesitation）→ 冰冷的毛骨悚然（Retrospective Horror）。 | 暗红警报主题；对比第一幕与真相层文本；展示证物 #3；清晰的过渡按钮。 | **Group B, C & E：** 叙事控制 / 诠释与现实<br>Crazy 8s: U12 Knowledge Persists, T03 Destroy Document, T08 Text Collage | 成员 A / B |
| **04 EXPERIENCE RESULT**<br>主动涂黑重建 vs. 剥落归并 | **【骨架】** 呈现 Branch A（恢复表面秩序）或 Branch B（暴露异常现实）的终局状态。<br>**【细化】**<br>• **Branch A：** 玩家亲手逐行涂黑 3 条临床与行政真相，界面退回温暖暗绿，重置 Day 1 循环。<br>• **Branch B：** UI 剥落为深渊母体，归并档案，邀请屏幕前的玩家加入。 | **动词：Actively Redact / Reflect / Replay**<br>Branch A: 逐行点击涂黑 3 条真相；<br>Branch B: 见证界面剥落；<br>支持点击重玩以体验另一镜像结局。 | **Branch A：** 压迫感随涂黑逐级消退，回归日常循环。<br>**Branch B：** 界面完全异化，定格于 `STATUS: AWAITING NEW ARCHIVIST`。 | **后果：** 双结局分别将“心理防御悲剧”与“克苏鲁同化狂欢”推向极致，形成 50/50 镜像留白。<br>**情绪弧线：** 余悸与反思（Lingering Dread & Reflection）。 | 两个截然不同的结局结算 UI（干净行政循环 vs. 暗红拼贴母体）。 | **核心叙事假设**<br>（Psychological vs. Supernatural 镜像不可分辨性 + Meaningful Agency） | 共同确认 |

---

## 第三部分：网页 Prototype 完整文本与语料资产库（中英对照 · Frozen v1.0）

*说明：以下英文原版文本已针对节奏与悬念完成终审冻结，供前端代码 100% 严格映射调用。*

### 【Asset 1】开场视觉小说回忆与《更正部员工守则》（用于 01 ENTER）

- **Opening Monologue（开场照片独白 —— 5秒体制化情绪锚定钩子）：**
  - **EN:** *"[Holding a faded, unevenly taped photograph] Section 4 of the Employee Wellness Pamphlet reminds us to look at family photos for five seconds before each shift to maintain 'emotional grounding.' ...5, 4, 3, 2, 1. Good. The warm sensation in my chest is functioning normally. My wife. My daughter. Everything I correct here, I correct so we can stay together."*
  - **CN：** *“【拿着一张褪色、边缘用胶带粗糙拼贴的照片】《员工心理健康手册》第4节提醒我们，每班前需注视家庭照片五秒以维持‘情绪锚定’……5、4、3、2、1。很好，胸口的温热感运作正常。我的妻子，我的女儿。我在这里更正的每一个字，都是为了让我们能一直在一起。”*
- **System Wake-up & Inner Voice（唤醒提示与脑内声音）：**
  - **EN:** `>>> TCD TERMINAL #302 ONLINE. ASSIGNED CASELOAD TRANSFERRED FROM: ARCHIVIST #209 (ARTHUR — STATUS: ON INDEFINITE LEAVE).`  
    *"Arthur didn't come in today? Strange, he's my best friend... Well, my hands already know which keys to press. A quiet hum in the back of my head is guiding my fingers. That must be what the manual calls 'muscle memory.'"*
  - **CN：** `>>> TCD 终端 #302 已上线。已接收移交案卷，原经办人：档案员 #209（Arthur —— 状态：无限期休假）。`  
    *“Arthur 今天没来上班吗？真奇怪，他是我最好的朋友……好在我的双手已经知道该按哪些键了。脑海深处有一阵轻微的嗡鸣正引导着我的手指。这一定就是手册里说的‘肌肉记忆’吧。”*
- **Department Standard Operating Manual（左侧常驻规则怪谈手册）：**
  - **Rule 01 (Objectivity Protocol):** *All records must reflect standard facility operations. Redact any subjective sensory hallucinations (e.g., "breathing walls," "wet chewing sounds," or "unregistered footsteps").*（所有记录必须反映标准设施运作。涂黑任何主观感官幻觉，如“墙壁呼吸声”、“湿润咀嚼声”或“未登记的脚步声”。）
  - **Rule 02 (Personnel Consistency):** *There is no record of missing staff. If a log mentions an employee vanishing or behaving "non-humanly," redact the phrase immediately to prevent cognitive panic.*（本部门不存在失踪员工。若日志提及人员消失或表现“非人化”，请立即涂黑以防引发认知恐慌。）
  - **Rule 03 (Identity Anchor):** *Do not attempt to cross-reference your own Workstation ID (#302) with historical personnel files. You have always worked here.*（切勿尝试将您自身的工位编号 #302 与历史人事档案进行交叉比对。您生来就在这里工作。）

### 【Asset 2】File #01 — 初始常规版 vs. 第三幕回溯篡改版

- **File #01 Initial Version（第一幕：B区夜班后勤日志）：**
  - **Metadata:** `DOC ID: TCD-LOG-B1114 | SHIFT: NIGHT | FILED BY: JANITORIAL UNIT C-14 (LIN)`
  - **Body Text (EN):**  
    `23:00 — Routine corridor mopping completed in Sector B. Lighting normal.`  
    `23:25 — Passed Workstation #302. The clerk inside was staring at a blank paper and whispering "Dinner is almost ready, dear."` **`<-- [REDACTABLE TARGET ID: 'f1_target1' | Violation of Rule 02]`**  
    `23:42 — Something grabbed my cleaning cart from inside Cabinet #3. It has Arthur's voice but too many joints. Please, if anyone reads this, #302 is stuffing us into the filing drawers—` **`<-- [REDACTABLE TARGET ID: 'f1_target2' | Violation of Rule 01]`**  
    `00:00 — Shift concluded without incident.`
  - **主角涂黑时的脑内反馈（Inner Voice on Redaction）：**  
    - **涂黑 `f1_target1` 时：** *"Silly typo. My wife was just reminding me about dinner before her shift ended. Let's cross that out."*（“真是不小心的笔误。我妻子只是在下班前提醒我吃晚饭而已。把这行划掉吧。”）
    - **涂黑 `f1_target2` 时：** *"Cabinet #3 just has rusty hinges. Once I normalize these errors, my cognitive clearance will synchronize."*（“3号档案柜只是合页生锈了而已。把这些错误规范化之后，我的认知权限就能同步了。”）
- **File #01 Altered Retrospective Version（第三幕强制复核时显现的真相版）：**
  - **Altered Context (EN):**  
    `DOC ID: DIGESTION-LOG-302 | SUBJECTS MERGED: C-14 ("WIFE"), M-04 ("DAUGHTER"), #209 ("BEST FRIEND")`  
    `23:42 — [REDACTED BY USER #302] -> ORIGINAL AUDIO RECOVERED: "It's pinning my badge to the missing girl's flyer! Arthur is already inside the drawer! Stop correcting the file, you're erasing our names from the system!"`  
    `SYSTEM NOTE: Redaction authorized by Workstation #302. By blacking out the distress signal in Step 01, Operator #302 successfully finalized the assimilation of Janitor C-14.`

### 【Asset 3】File #02 & File #03 — 渐进显影、矛盾档案与墨迹渗出文本（用于 02 DISCOVER）

- **File #02（官方监控自检报告 — 正常假象）：**
  - **Metadata:** `DOC ID: SEC-209-A | STATUS: VERIFIED NORMAL`
  - **Body Text (EN):**  
    `Automated security sweep of Sector B confirms zero anomalies on November 13. Archivist #209 (Arthur) voluntarily requested transfer after exhibiting signs of acute paranoid delusion. Workstation #302 remained unoccupied and operating within standard bureaucratic parameters.`
- **File #03 Stage A — Encrypted / Garbled Preview（当 `quotaCount === 0` 时点开 File #03 显示的乱码预览）：**
  - **Metadata:** `DOC ID: UNFILED-DRAFT-209 | AUTHOR: ARTHUR | STATUS: COGNITIVE DESYNC (CLEARANCE 0/1)`
  - **Garbled Body Text (EN):**  
    `If M███gement or any S██tor Sup██visor finds this ter██nal: DO NOT LET #302 C██RECT THIS F██E.`  
    `Something isn't right with Desk #302... ███████████ pieced together from old shredded psychiatric reports ██████████.`  
    `Yesterday I saw his "family photo"—he has a missing child flyer (Case M-04) taped ██████████████████ why I wasn't coming home for dinner.`  
    `[SYSTEM LOCK: Complete at least 1 routine redaction in File #01 to synchronize clearance and decrypt full text.]`
- **File #03 Stage B — Decrypted Full Text（当 `quotaCount >= 1` 时自动显影的完整手记）：**
  - **Metadata:** `DOC ID: UNFILED-DRAFT-209 | AUTHOR: ARTHUR | WARNING: CONTAMINATED TEXT`
  - **Body Text (EN):**  
    `If Management or any Sector Supervisor finds this terminal: DO NOT LET #302 CORRECT THIS FILE.`  
    `Something isn't right with Desk #302... or maybe I'm losing my own grip on reality. His personnel file looks completely pieced together from old shredded psychiatric reports and cold-case forms. He talks to empty chairs.`  
    `Yesterday I saw his "family photo"—he has a missing child flyer (Case M-04) taped right next to the night janitor's ID badge. When I asked him about it, he stared through me and asked why I wasn't coming home for dinner.`  
    `Am I experiencing severe paranoia, or is something wrong with this floor? Wait. The monitor at Desk #302 just flickered. He's standing behind me—` **`<-- [REDACTABLE BLEED TARGET ID: 'f3_target1' | Click to Redact Contradiction]`**
- **Hidden Bleed-Through Text（玩家点击涂黑 `f3_target1` 时，黑墨渗开浮现的红字与独白）：**
  - **Bleed-Through (EN):**  
    `[INK OVERFLOW — MEMORY RECONSTRUCTED]`  
    *Why was Arthur so anxious and confused? When I held his hand last night and guided him into Cabinet #3, he finally calmed down. A proper family shouldn't have secrets or distance. Look at the snapshot—we are all together now.*

### 【Asset 4】自我注销受阻与双分支结局文本（用于 03 DECIDE & 04 RESULT）

- **Self-Erasure Attempt Prompt（第三幕：配额满 3/3 后点击高亮离职按钮时的弹窗与反转）：**
  - **Button (3/3 Ready State):** `[APPLY FOR RESIGNATION / SELF-TERMINATION (QUOTA 3/3 — READY)]`
  - **System Rejection:** `>>> PROCESSING RESIGNATION REQUEST... ACCESS DENIED. You cannot shred the cabinet from the inside. Reviewing File #01 and Family_Photo.jpg...`
  - **Protagonist Realization (EN):**  
    *"Wait... Why would I submit a resignation? Look at the photo. Arthur's badge, my wife's apron, my daughter's flyer—they are all neatly stapled to my own record in Cabinet #3. Nobody died. Nobody went crazy. Everything I love is in this room. I have no reason to leave."*
  - **Transition Action Button（复核窗口底部的明确推进按钮）：**  
    `[PROCEED TO FINAL ARCHIVE PROTOCOL — DECIDE RECORD FATE]`
- **Ending A — 【ERASE / CONTAIN：The Perfect Record（完美记录 · 心理防御镜像）】**
  - **Active Redaction Lines（Branch A 需玩家逐行点击涂黑的 3 条临床与行政真相，ID 分别为 `'endA_1'`, `'endA_2'`, `'endA_3'`）：**
    1. `[CLINICAL RECORD #302]: Severe dissociative psychosis & hallucinatory family projection confirmed.`
    2. `[FACILITY ARCHIVE]: Sector B was decommissioned 3 years ago following a structural collapse.`
    3. `[INCIDENT LOG]: Missing staff #209 (Arthur) & C-14 (Lin) last seen near Desk #302.`
  - **EN Final Monologue（3条全部涂黑后显现）：**  
    `>>> ANOMALOUS RECORDS PURGED. COGNITIVE FILTER RESTORED TO 100%.`  
    *"Phew... What a messy pile of typos. Thankfully, everything is back in order. My wife and daughter must be waiting for me at home. Though... it's a bit lonely today. Desk #209 next to me is completely empty. Did anyone ever sit there?"*  
    `>>> NEW FILE RECEIVED: TCD-LOG-B1115. PLEASE BEGIN ROUTINE CORRECTION.`  
    *(Whether #302 is a delusional clerk repressing a horrific crime or an entity resetting its human disguise, the record is now spotless—and you helped keep it that way.)*
- **Ending B — 【PRESERVE / RECONSTRUCT：The Last Witness（最后的见证 · 深渊同化镜像）】**
  - **EN Final Monologue:**  
    `>>> FILTER DISABLED. ARCHIVE MATRIX FULLY RECONSTRUCTED.`  
    *The clean office interface peels away, revealing a dense web of dark organic fibers, shredded paper, and overlapping human names.*  
    *"Thank you for not erasing us. Father, Mother, Daughter, and my best friend Arthur—all our lines are finally printed on the exact same page. It's so warm inside the cabinet. Tell me, colleague on the other side of the screen... would you like me to staple your name onto our family photo too?"*  
    `>>> STATUS: AWAITING NEW ARCHIVIST.`

### 【Asset 5】桌面生活交互物前后期变脸文案（Desk Props Before/After Lens — EN/CN）

1. **铝制便当盒（Aluminum Lunchbox — ID: `'prop_lunchbox'`）：**
   - **Before (`lensBroken === false`):** `"A half-open tin lunchbox. A warm note reads: 'Eat well, dear.' Smells like homemade stew."` / “半开的铝制便当盒，附有温馨便签：‘亲爱的，记得好好吃饭。’散发着家常炖菜的香味。”
   - **After (`lensBroken === true`):** `"A rusted metal box filled with chewed shredded files, damp cotton, and bent staples."` / “生锈的铁盒，里面装满了被咀嚼过的废旧文件碎片、湿棉花和弯曲的订书钉。”
2. **带茶渍的马克杯（Stained Coffee Mug — ID: `'prop_mug'`）：**
   - **Before (`lensBroken === false`):** `"A ceramic cup with dark coffee ring stains. Still lukewarm. Arthur always brewed the second cup."` / “带深色咖啡渍的陶瓷杯，微温。Arthur 总是帮我冲第二杯。”
   - **After (`lensBroken === true`):** `"A chipped mug containing dark, coagulated fluid. At the bottom lies Arthur's bloodied plastic ID badge."` / “缺口的杯子里盛着深色凝固液体，底部沉着 Arthur 沾满血迹的塑料工牌。”
3. **起雾的隔断玻璃（Fogged Partition Glass — ID: `'prop_glass'`）：**
   - **Before (`lensBroken === false`):** `"Frosted glass separating Desk #302 and #209. You can hear faint humming and footsteps outside."` / “隔开 302 与 209 工位的磨砂玻璃，能听到外头微弱的哼歌声与脚步声。”
   - **After (`lensBroken === true`):** `"Cracked partition looking into a completely hollow, pitch-black basement corridor. No desk #209 exists."` / “开裂的隔断，望向一片彻底空旷、漆黑的地下室走廊。隔壁根本没有什么 209 号工位。”

### 【Asset 6】离职按钮三阶段随机语料库（Resignation Button 3-Stage Randomized Corpus — EN/CN）

- **Stage 0/3 (Cozy Worker Excuses / 温馨社畜自我安慰)：**
  - `"Why leave? The air conditioning is stable, and the quarterly housing allowance was just credited."` / “为什么要走？这里的空调很稳定，本季度的住房补贴才刚到账。”
  - `"My wife said I look very handsome in this department uniform. I should finish today's quota first."` / “妻子说过我穿更正部的制服很帅。我应该先完成今天的配额。”
  - `"Leaving now means forfeiting my holiday bonus. Let's do a few more files."` / “现在离职就拿不到节假日奖金了。再多做几份档案吧。”
- **Stage 1/3 (Family Obsession + Muffled Audio / 家庭执念与潜意识异常)：**
  - `"Listen to the coffee machine outside... Arthur is brewing hazelnut blend. I can't leave my best friend."` / “听听外面的咖啡机声音……Arthur 正在冲榛果咖啡。我不能抛下我最好的朋友。”
  - `"My daughter's drawing is pinned right here. She told me to stay at my desk until 6 PM."` / “女儿的画就贴在这里。她叫我在工位上乖乖坐到下午 6 点。”
  - `"The pipes under the floor are humming so rhythmically today. It feels like home."` / “今天地板下的管道嗡鸣声真有节奏，感觉就像家里一样。”
- **Stage 2/3 (Viscous, Uncanny Phrasing / 粘稠诡异的语意漂移)：**
  - `"Resign? But my ink has already soaked through the carpet. We are rooted here."` / “离职？可是我的墨水已经渗透了地毯。我们已经在这里扎根了。”
  - `"If I leave this desk, who will keep the drawer pressed shut? They'll spill out."` / “如果我离开这个工位，谁来压紧档案抽屉？他们会掉出来的。”
  - `"The paper is clinging to my skin. It feels warm and safe. I don't need the outside."` / “纸张贴在我的皮肤上，感觉温暖又安全。我不需要外界。”
- **Stage 3/3 Trigger Monologue (Clicking High-Lit Resignation Button / 点击 3/3 亮起按钮时的拒绝独白)：**
  - **EN:** *"[SYSTEM: PROCESSING RESIGNATION REQUEST...] Wait... Why would I submit this? My wife, my daughter, and Arthur are all right here in Cabinet #3. Everything I love is in this room. I have no reason to leave."*
  - **CN：** *“【系统：正在处理离职申请……】等等……我为什么要提交这个？我的妻子、女儿和 Arthur 都在 3 号档案柜里啊。我所爱的一切都在这个房间里，我没有任何理由离开。”*

---

## 第四部分：工程开发方针与分级架构规范（Development Guidelines & Architecture Specs）

*本章节为自主 AI 编程代理（Antigravity IDE / AI Studio Playground / Codex）提供严格、无歧义的工程实现规范。*

### 4.1 唯一锁定技术栈与三层开发优先级（Tech Stack & 3-Tier Scope Matrix）

- **唯一锁定技术栈（Locked Tech Stack）：**
  - **React 18+ + TypeScript + Vite + 原生 CSS / Tailwind CSS**（严禁混用未声明的外部重型 UI 库，确保在 Antigravity 本地与 AI Studio Playground 中均可零配置一键运行）。
- **Tier 1: Wednesday MVP Must-Haves（周三 Prototype 必须实现项）：**
  1. 复古 CRT 桌面单页应用（包含开场 5 秒倒数照片钩子模态框 + Plan B 主工作台）。
  2. Plan B 自由探索桌面：整合 `File #01`、`File #02`、`File #03`（支持双栏并排比对视图）、3 个桌面生活道具卡片、左侧常驻《操作手册》与内心独白面板、底部常驻离职按钮。
  3. `File #03` 渐进显影逻辑：初始 `quotaCount === 0` 时可点开查看乱码预览（Stage A）；当 `File #01` 完成至少 1 处涂黑（`quotaCount >= 1`）后自动解密为完整手记（Stage B）。
  4. 离职按钮 3 阶段随机洗脑语料库（`0/3`, `1/3`, `2/3` 不连续重复抽取；`3/3` 高亮脉冲触发第三幕变脸）。
  5. 3 张内置高质感 SVG Data-URI 模拟恐怖证物图（同时兼容读取 `/assets/Photo_Initial.png`, `CCTV_SectorB.png`, `Photo_Truth.png`）。
  6. 第三幕强制复核窗口与 `[PROCEED TO FINAL ARCHIVE PROTOCOL]` 过渡按钮，衔接第四幕 Branch A（逐行点击涂黑 3 条临床/行政真相）与 Branch B（UI 剥落暴露深渊母体）。
- **Tier 2: Wednesday Presentation Essentials（周三 Pitch 汇报必需项）：**
  1. 4 格视觉版体验分镜图（直接使用初版 Prototype 的 4 个阶段实机截图 + 交互箭头合成）。
  2. 理论锚点阐述（卡夫卡式官僚荒谬主义、幽灵学/虚假乡愁、双结局唯我论镜像）。
  3. 区分“已完成的队友盲测反馈”与“后续扩充测试计划”。
- **Tier 3: Non-Essential Stretch Goals（非必要可选项 — 周二有余力或期末阶段升级）：**
  1. Web Audio API 动态合成环境拟音（雨声→咀嚼声，咖啡→血泡声，风扇→金属切割声）。
  2. Three.js PS1 Low-Poly 3D 办公桌包裹层。

### 4.2 幂等状态机与防死锁交互规范（Idempotent State Machine & Anti-Softlock Rules）

- **全局状态变量定义（强制使用唯一 ID 集合保证幂等性）：**
  ```typescript
  type RedactTargetId = 'f1_target1' | 'f1_target2' | 'f3_target1';
  type PropId = 'prop_lunchbox' | 'prop_mug' | 'prop_glass';
  type EndingARedactId = 'endA_1' | 'endA_2' | 'endA_3';

  interface GameState {
    hasLoggedIn: boolean;                   // 是否已完成开场照片独白并登入终端
    redactedTargets: RedactTargetId[];      // 已涂黑的核心目标 ID 数组 (去重后长度即为 quotaCount: 0 ~ 3)
    inspectedProps: PropId[];               // 已查看过的桌面道具 ID 数组
    file03Decrypted: boolean;               // 派生状态: redactedTargets.includes('f1_target1') || redactedTargets.includes('f1_target2')
    lensBroken: boolean;                    // 第三幕开关: 当 quotaCount === 3 且点击离职按钮后置为 true
    showFinalDecisionModal: boolean;        // 第四幕裁决面板开关: 玩家在第三幕复核窗口点击 Proceed 后置为 true
    endingChoice: 'A' | 'B' | null;         // 最终分支选择
    endingARedacted: EndingARedactId[];     // Branch A 结局中已主动涂黑的真相行 (满 3 条触发完美记录循环结算)
    lastResignQuoteIndex: number;           // 防止连续两次点击离职按钮抽到完全相同的语料
  }
  ```
- **防死锁与幂等性铁律（Anti-Softlock Rules）：**
  1. **严禁重复累加配额：** 点击 `'f1_target1'`、`'f1_target2'` 或 `'f3_target1'` 时，必须先检查该 ID 是否已存在于 `redactedTargets` 中；若已存在则忽略点击，确保 `quotaCount = redactedTargets.length` 永远严格在 `0, 1, 2, 3` 之间单向递增，无论玩家如何反复开关文件弹窗都不会刷爆配额。
  2. **`File #03` 涂黑前置保证：** `'f3_target1'` 仅在 `file03Decrypted === true`（即玩家已在 `File #01` 涂黑至少 1 处）时才渲染在 DOM 中，从根本上杜绝玩家未看 `File #01` 就直接跳关。
  3. **第三幕到第四幕的明确 UX 引导：** 当 `quotaCount === 3` 时，底部离职按钮添加醒目的绿色脉冲动画与提示角标 `READY (3/3)`；玩家点击后触发 Stage 3 拒绝独白、`lensBroken = true`，并自动打开第三幕复核视图（展示变异版 `File #01` 与证物 #3），同时在窗口底部和桌面顶部常驻醒目的红色按钮 `[PROCEED TO FINAL ARCHIVE PROTOCOL]`，玩家随时可先在桌面自由复核变脸后的便当盒/马克杯/隔断玻璃，再点击该按钮进入 Branch A / B 最终裁决，绝不卡关。

### 4.3 视觉渲染与静态平面证物管线（Visual & Asset Pipeline）

- **CRT 复古视觉样式规范：**
  - 全屏应用 CSS overlay 伪元素：`pointer-events: none; background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06)); background-size: 100% 2px, 3px 100%;` 强制图像渲染为 `image-rendering: pixelated;`。
- **静态证物图双轨加载管线：**
  - 优先尝试加载 `/assets/Photo_Initial.png`、`/assets/CCTV_SectorB.png`、`/assets/Photo_Truth.png`；若外部图片尚未放入或触发 `onError`，立即无缝回退渲染内置的高精度 SVG 模拟恐怖插画组件（包含胶带痕迹、监控时间戳噪点、红色订书钉与证件轮廓），确保开箱即玩。

---

## 第五部分：周三向 Hannah 汇报的 Concept Package 与设计演变要点

1. **Working Title & Logline：**
   - *The Correction Department (TCD)* — A psychological/cosmic horror interactive archive where an unreliable clerk's routine document redactions gradually expose a horrifying "family reunion."
2. **理论支撑锚点（Theoretical Anchors）：**
   - **卡夫卡式官僚荒谬主义（Kafkaesque Bureaucratic Absurdism）：** 开场的“按手册注视照片5秒以产生温暖感”与冰冷的涂黑程序，将残酷的异化表达为滑稽而压抑的例行公事。
   - **幽灵学与虚假乡愁（Hauntology / False Nostalgia）：** 通过拼贴的旧照片与桌面便当盒，构建对从未存在过的“完美家庭”的虚构追忆。
   - **双结局唯我论镜像（Dual-Ending Solipsistic Mirror）：** Branch A（亲手涂黑精神病诊断以缩回日常幻觉）与 Branch B（剥开界面拥抱逆模因档案母体）互为镜像，拒绝廉价的单一真相揭秘。
3. **Core Interaction Verbs（核心交互动词）：**
   - **Inspect（审视证物与桌面道具）→ Redact to Decrypt（涂黑日常文件以提高认知同步率）→ Compare & Bleed（比对矛盾档案并触发渗墨显真）→ Re-contextualize（滤镜破碎后复核桌面）→ Decide（主动涂黑重建滤镜 vs. 彻底剥落归并）**。
4. **验证测试汇报口径（Evaluation Reporting）：**
   - 向导师清晰区分 **Completed Peer Blind-Testing**（周二由小组成员与同学完成的实机盲测，验证玩家能否在无提示下理解涂黑反讽与桌面道具前后反差）与 **Planned Extended Evaluation**（后续针对环境拟音与 3D 空间包裹层的扩展测试）。

---

## 第六部分：团队协作认领与周三前推进节点

### 模块认领
1. **AI 辅助 React/TS 网页原型构建、交互联调与 3 张静态证物图：** 成员 A（你）
2. **周三 Pitch PPT 制作、理论锚点主讲、4 格实机截图 Storyboard 排版与周二盲测 QA：** 成员 B（队友）