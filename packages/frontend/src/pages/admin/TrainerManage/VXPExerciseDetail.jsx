// src/pages/admin/TrainerManage/VXPExerciseDetail.jsx
import React from "react";
import { Info } from "lucide-react";
import { vxpGetExerciseImage } from "./vxpImages.js";

/** ================== GUIDES NGỰC (GIỮ NGUYÊN) ================== */
const CHEST_GUIDES = [
  {
    id: "lever-military-press",
    keywords: [
      /(^|[^a-z])lever([^a-z]|$)/, /(^|[^a-z])military([^a-z]|$)/,
      /(^|[^a-z])machine([^a-z]|$)/, /shoulder\s*press/,
      /with\s*strength/, /lever\s*military\s*press\s*with\s*strength/,
    ],
    guide: {
      difficulty: "Trung cấp",
      exercise_type: "Sức mạnh (Shoulder Press – Máy Lever)",
      log_type: "Tạ & Số lần lặp",
      equipment: "Máy Lever Shoulder Press + Ghế ngồi",
      steps: [
        { title: "Chuẩn bị:", text: "Chỉnh ghế tay nắm ngang/nhỉnh hơn vai; lắp mức tạ phù hợp, tựa lưng vững." },
        { title: "Vị trí tay:", text: "Nắm hơi rộng hơn vai; cổ tay thẳng; bả vai kéo nhẹ về sau." },
        { title: "Đẩy lên:", text: "Đẩy theo quỹ đạo máy; siết core, tránh ưỡn lưng." },
        { title: "Hạ xuống:", text: "Hạ có kiểm soát tới ngang tai/đỉnh vai; khuỷu hơi chéo về trước." },
        { title: "Nhịp thở:", text: "Thở ra khi đẩy; hít vào khi hạ." },
      ],
    },
  },
  {
    id: "dumbbell-arnold-press",
    keywords: [
      /(^|[^a-z])arnold([^a-z]|$)/, /dumbbell\s*arnold/,
      /arnold\s*press\s*v\s*2/, /arnold\s*press\s*2/, /v\s*2/,
    ],
    guide: {
      difficulty: "Trung cấp",
      exercise_type: "Sức mạnh & Hypertrophy",
      log_type: "Tạ & Số lần lặp",
      equipment: "Tạ tay + Ghế ngồi có tựa",
      steps: [
        { title: "Chuẩn bị:", text: "Ngồi ghế tựa, hai tạ trước vai, lòng bàn tay hướng vào mặt." },
        { title: "Xoay & đẩy:", text: "Đẩy tạ lên đồng thời xoay cổ tay để lòng bàn tay hướng ra trước." },
        { title: "Đỉnh động tác:", text: "Duỗi gần thẳng tay (không khoá); giữ thân ổn định." },
        { title: "Hạ xuống:", text: "Hạ có kiểm soát và xoay ngược cổ tay về vị trí ban đầu." },
        { title: "Nhịp thở:", text: "Thở ra khi đẩy; hít vào khi hạ." },
      ],
    },
  },
  // ============== NGỰC GIỮA (10 bài giữ nguyên như bạn) ==============
  {
    id: "barbell-decline-close-grip-to-skull-press",
    keywords: [/decline\s*close\s*grip.*skull/, /close\s*grip.*skull/, /skull\s*press/],
    guide: {
      difficulty: "Trung cấp",
      exercise_type: "Sức mạnh (Compound biến thể)",
      log_type: "Tạ & Số lần lặp",
      equipment: "Ghế decline + Tạ đòn",
      steps: [
        { title: "Chuẩn bị:", text: "Nằm ghế decline; nắm hẹp bằng/nhỏ hơn vai; nhấc đòn." },
        { title: "Hạ về trán:", text: "Gập khuỷu, hạ về gần trán (kiểm soát), bắp tay cố định." },
        { title: "Chuyển pha:", text: "Đưa đòn về trên ngực giữa rồi đẩy thẳng lên." },
        { title: "Biên độ:", text: "Khuỷu khép tương đối; không nảy đòn." },
        { title: "Thở:", text: "Hít khi hạ; thở khi đẩy." },
      ],
    },
  },
  {
    id: "cable-incline-fly-on-stability-ball",
    keywords: [/cable\s*incline\s*fly/, /stability\s*ball/, /swiss\s*ball/],
    guide: {
      difficulty: "Mới bắt đầu – Trung cấp",
      exercise_type: "Isolation (Fly)",
      log_type: "Tạ & Số lần lặp",
      equipment: "Máy cáp đôi + Bóng tập/ghế dốc",
      steps: [
        { title: "Chuẩn bị:", text: "Tựa bóng/ghế dốc; pulley thấp–trung; cánh tay hơi gập." },
        { title: "Ép vào:", text: "Khép hai tay theo vòng cung trước ngực; tránh dùng vai quá mức." },
        { title: "Góc tay:", text: "Khuỷu hơi gập suốt động tác, không khoá khớp." },
        { title: "Kiểm soát:", text: "Dừng ngắn ở điểm gần chạm, siết ngực." },
        { title: "Thở:", text: "Thở ra khi khép; hít vào khi dang." },
      ],
    },
  },
  {
    id: "barbell-press-sit-up",
    keywords: [/barbell\s*press\s*sit\s*up/],
    guide: {
      difficulty: "Nâng cao",
      exercise_type: "Compound (Core + Ngực)",
      log_type: "Tạ & Số lần lặp",
      equipment: "Tạ đòn + thảm/ghế",
      steps: [
        { title: "Chuẩn bị:", text: "Nằm ngửa cầm tạ đòn; gối gập; chân chạm sàn." },
        { title: "Gập & đẩy:", text: "Gập thân ngồi dậy đồng thời đẩy đòn lên." },
        { title: "Xuống:", text: "Hạ đòn và hạ thân về vị trí nằm; core chặt." },
        { title: "An toàn:", text: "Dùng tạ nhẹ–vừa; có spotter nếu cần." },
        { title: "Thở:", text: "Thở ra khi gập/đẩy; hít khi hạ." },
      ],
    },
  },
  {
    id: "lever-chest-press",
    keywords: [/lever\s*chest\s*press/, /machine\s*chest\s*press/],
    guide: {
      difficulty: "Mới bắt đầu – Trung cấp",
      exercise_type: "Sức mạnh (Máy Lever)",
      log_type: "Tạ & Số lần lặp",
      equipment: "Máy Lever Chest Press",
      steps: [
        { title: "Chuẩn bị:", text: "Chỉnh ghế tay nắm ngang ngực; bả vai ép về sau." },
        { title: "Đẩy:", text: "Đẩy về trước tới gần duỗi thẳng, không khoá khuỷu." },
        { title: "Hạ:", text: "Hạ chậm có kiểm soát tới ngang ngực." },
        { title: "Tập trung:", text: "Giữ ngực mở, không nhún vai; core vững." },
        { title: "Thở:", text: "Thở ra khi đẩy; hít khi hạ." },
      ],
    },
  },
  {
    id: "close-grip-push-up",
    keywords: [/close\s*grip\s*push\s*up/, /diamond\s*push\s*up/],
    guide: {
      difficulty: "Mới bắt đầu – Trung cấp",
      exercise_type: "Bodyweight (Triceps + Ngực giữa)",
      log_type: "Số lần lặp",
      equipment: "Trọng lượng cơ thể",
      steps: [
        { title: "Chuẩn bị:", text: "Tay hẹp (kim cương/close), thân thẳng, core siết." },
        { title: "Hạ xuống:", text: "Gập khuỷu sát người, hạ ngực gần sàn." },
        { title: "Đẩy lên:", text: "Đẩy thẳng tay; không xoè khuỷu 90°." },
        { title: "Biên độ:", text: "Trong khả năng kiểm soát, không võng lưng." },
        { title: "Thở:", text: "Hít khi hạ; thở khi đẩy." },
      ],
    },
  },
  {
    id: "cable-standing-up-straight-crossovers",
    keywords: [/cable\s*standing.*crossovers/, /standing\s*high\s*cable\s*fly/],
    guide: {
      difficulty: "Mới bắt đầu – Trung cấp",
      exercise_type: "Isolation (Cable Crossover)",
      log_type: "Tạ & Số lần lặp",
      equipment: "Máy cáp đôi (pulley cao)",
      steps: [
        { title: "Chuẩn bị:", text: "Đứng lùi 1 bước, cầm pulley cao; bả vai khoá về sau." },
        { title: "Kéo chéo:", text: "Kéo hai tay khép chéo trước ngực theo vòng cung." },
        { title: "Đỉnh:", text: "Dừng 1 giây, siết ngực; không chạm rầm mạnh." },
        { title: "Hồi về:", text: "Trả tay theo vòng cung, giữ căng cơ." },
        { title: "Thở:", text: "Thở ra khi kéo; hít khi trả." },
      ],
    },
  },
  {
    id: "assisted-wide-grip-chest-dip-kneeling",
    keywords: [/assisted.*wide.*dip/, /kneeling.*dip/],
    guide: {
      difficulty: "Mới bắt đầu – Trung cấp",
      exercise_type: "Bodyweight hỗ trợ (Dip nhấn ngực)",
      log_type: "Số lần lặp / Trợ lực",
      equipment: "Máy hỗ trợ Dip hoặc dây trợ lực",
      steps: [
        { title: "Chuẩn bị:", text: "Tay bám rộng; gối lên bệ trợ lực; hơi nghiêng người trước." },
        { title: "Hạ xuống:", text: "Hạ tới khi ngực căng; khuỷu hướng chéo sau." },
        { title: "Đẩy lên:", text: "Đẩy thẳng tay, giữ vai xuống – không nhún lên tai." },
        { title: "Góc thân:", text: "Nghiêng trước để nhấn ngực." },
        { title: "Thở:", text: "Hít khi hạ; thở khi đẩy." },
      ],
    },
  },
  {
    id: "chest-dip-on-straight-bar",
    keywords: [/chest\s*dip.*straight\s*bar/, /bar\s*dip/],
    guide: {
      difficulty: "Trung cấp – Nâng cao",
      exercise_type: "Bodyweight (Dip nhấn ngực)",
      log_type: "Số lần lặp / Thêm tạ nếu có",
      equipment: "Xà song song hoặc thanh thẳng",
      steps: [
        { title: "Chuẩn bị:", text: "Nắm xà chắc, hơi nghiêng người; chân gập sau." },
        { title: "Hạ:", text: "Hạ tới khi vai dưới khuỷu nhẹ; khuỷu chéo sau." },
        { title: "Đẩy:", text: "Đẩy thẳng tay, giữ vai thấp; tránh khoá gắt." },
        { title: "Kiểm soát:", text: "Không bật nảy; biên độ phù hợp khớp vai/khuỷu." },
        { title: "Thở:", text: "Hít khi hạ; thở khi đẩy." },
      ],
    },
  },
  {
    id: "barbell-front-raise-and-pullover",
    keywords: [/barbell\s*front\s*raise.*pullover/, /pullover/],
    guide: {
      difficulty: "Trung cấp",
      exercise_type: "Compound/Accessory",
      log_type: "Tạ & Số lần lặp",
      equipment: "Tạ đòn + ghế/đứng",
      steps: [
        { title: "Chuẩn bị:", text: "Đứng/chọn ghế; nắm đòn hẹp–vừa; core siết." },
        { title: "Front raise:", text: "Nâng đòn ngang vai, kiểm soát – không vung." },
        { title: "Pullover:", text: "Hạ vòng cung qua đầu ra sau (nếu nằm ghế) rồi kéo về trước." },
        { title: "Kiểm soát vai:", text: "Giữ vai xuống – tránh nhún lên tai." },
        { title: "Thở:", text: "Thở ra khi nâng/kéo; hít vào khi hạ." },
      ],
    },
  },
  {
    id: "full-planche-push-up",
    keywords: [/full\s*planche\s*push\s*up/, /planche/],
    guide: {
      difficulty: "Rất nâng cao",
      exercise_type: "Calisthenics (Ngực + Vai trước + Core)",
      log_type: "Số lần lặp / Thời gian giữ",
      equipment: "Trọng lượng cơ thể, parallettes (khuyên dùng)",
      steps: [
        { title: "Chuẩn bị:", text: "Planche lean mạnh; tay xoay ngoài nhẹ; core–mông siết." },
        { title: "Xuống:", text: "Giữ thân thẳng; gập khuỷu tới biên độ cho phép (không sụm hông)." },
        { title: "Lên:", text: "Đẩy mạnh lên; kiểm soát scapula (protraction)." },
        { title: "Tiến trình:", text: "Tuck → advanced tuck → straddle → full; dùng band hỗ trợ nếu cần." },
        { title: "An toàn:", text: "Khởi động cổ tay/khuỷu kỹ; tránh đau khớp vai." },
      ],
    },
  },
];

/** ================== GUIDES LƯNG (MỚI THÊM) ================== */
// ================== BACK_GUIDES (Lưng: Lat, Lưng giữa, Cơ thang) ==================
const BACK_GUIDES = [
  // Wide-grip Pull-up
  {
    id: "wide-grip-pull-up",
    keywords: [/wide\s*grip.*pull\s*up/i, /pull\s*up.*wide/i, /\bwidegrippullup\b/i, /\bpullup\b.*wide/i, /\blat\b.*pull/i],
    guide: {
      difficulty: "Trung cấp",
      exercise_type: "Bodyweight (Kéo xà rộng đánh Lat)",
      log_type: "Số lần lặp / Trọng lượng thêm (nếu có)",
      equipment: "Xà đơn",
      steps: [
        { title: "Chuẩn bị:", text: "Nắm xà rộng hơn vai; bả vai hạ xuống và kéo về sau (depress & retract)." },
        { title: "Kéo lên:", text: "Kéo khuỷu xuống–ra hai bên; ngực hướng lên xà; không nhô vai lên tai." },
        { title: "Đỉnh:", text: "Cằm qua xà (hoặc ngực chạm xà nếu kiểm soát tốt), giữ 1 giây siết Lat." },
        { title: "Hạ xuống:", text: "Hạ có kiểm soát tới tay gần duỗi thẳng; giữ căng cơ liên tục." },
      ],
    },
  },

  // Chin-up
  {
    id: "chin-up",
    keywords: [/\bchin\s*up\b/i, /\bchinup\b/i],
    guide: {
      difficulty: "Mới bắt đầu – Trung cấp",
      exercise_type: "Bodyweight (Kéo xà ngửa tay – Lat + tay trước)",
      log_type: "Số lần lặp",
      equipment: "Xà đơn",
      steps: [
        { title: "Chuẩn bị:", text: "Nắm tay ngửa bằng vai; bả vai hạ; core siết." },
        { title: "Kéo lên:", text: "Dẫn động từ Lat, kéo khuỷu về hông; không đẩy cằm ra trước." },
        { title: "Đỉnh:", text: "Cằm vượt xà; giữ 1 giây." },
        { title: "Hạ:", text: "Hạ chậm; vai vẫn hạ, tránh buông rơi." },
      ],
    },
  },

  // Assisted Pull-up
  {
    id: "assisted-pull-up",
    keywords: [/assisted.*pull\s*up/i, /\bband.*pull\s*up\b/i],
    guide: {
      difficulty: "Mới bắt đầu",
      exercise_type: "Bodyweight hỗ trợ",
      log_type: "Số lần lặp / Mức trợ lực",
      equipment: "Máy trợ lực hoặc dây kháng lực",
      steps: [
        { title: "Thiết lập:", text: "Chọn trợ lực vừa đủ để còn nặng, vẫn chuẩn form." },
        { title: "Kéo:", text: "Giữ core chặt; bả vai hạ xuống trước khi kéo." },
        { title: "Hạ:", text: "Kiểm soát biên độ; không để dây/đòn kéo bật nảy." },
      ],
    },
  },

  // Lat Pulldown (cáp cao)
  {
    id: "lat-pulldown",
    keywords: [/\blat\s*pulldown\b/i, /cable\s*lat\s*pulldown/i, /\bpulldown\b/i],
    guide: {
      difficulty: "Mới bắt đầu – Trung cấp",
      exercise_type: "Isolation/Accessory (Lat)",
      log_type: "Tạ & Số lần lặp",
      equipment: "Máy cáp cao + thanh kéo",
      steps: [
        { title: "Chuẩn bị:", text: "Ghế vừa tầm; đệm đùi cố định; tay nắm rộng vừa." },
        { title: "Kéo xuống:", text: "Dẫn khuỷu về hông; ngực mở; thanh về ngang cằm/ngực trên." },
        { title: "Hồi lên:", text: "Thả có kiểm soát; bả vai vẫn hạ; duy trì căng cơ." },
      ],
    },
  },

  // Reverse-grip Machine Lat Pulldown
  {
    id: "reverse-grip-machine-lat-pulldown",
    keywords: [/reverse\s*grip.*lat\s*pulldown/i, /underhand.*pulldown/i],
    guide: {
      difficulty: "Trung cấp",
      exercise_type: "Isolation (Lat + dưới tay trước)",
      log_type: "Tạ & Số lần lặp",
      equipment: "Máy/ cáp cao + tay nắm ngửa",
      steps: [
        { title: "Chuẩn bị:", text: "Tay nắm ngửa hẹp–vừa; ngực mở; bả vai hạ." },
        { title: "Kéo:", text: "Kéo khuỷu sát thân hướng về hông; không ngửa lưng quá mức." },
        { title: "Hồi:", text: "Thả chậm, kiểm soát vai; không rút vai lên tai." },
      ],
    },
  },

  // Lever Front Pulldown / Machine Front Pulldown
  {
    id: "lever-front-pulldown",
    keywords: [/lever\s*front\s*pulldown/i, /machine\s*front\s*pulldown/i, /\bfront\s*pulldown\b/i],
    guide: {
      difficulty: "Mới bắt đầu – Trung cấp",
      exercise_type: "Sức mạnh (Máy Lever – Lat)",
      log_type: "Tạ & Số lần lặp",
      equipment: "Máy Lever Front Pulldown",
      steps: [
        { title: "Setup:", text: "Chỉnh ghế/đệm đùi; tay nắm phù hợp biên độ máy." },
        { title: "Kéo:", text: "Kéo thanh/tay nắm về ngang ngực; khuỷu hướng về hông." },
        { title: "Hồi:", text: "Hồi theo quỹ đạo máy; không bật nảy." },
      ],
    },
  },

  // Barbell Row (Bent-over)
  {
    id: "barbell-row",
    keywords: [/barbell\s*row/i, /bent\s*over\s*row/i],
    guide: {
      difficulty: "Trung cấp",
      exercise_type: "Compound (Lưng giữa + Lat + core chống đỡ)",
      log_type: "Tạ & Số lần lặp",
      equipment: "Tạ đòn",
      steps: [
        { title: "Chuẩn bị:", text: "Hông gập, lưng phẳng; thanh trên giữa bàn chân; nắm rộng vừa." },
        { title: "Kéo:", text: "Kéo đòn về bụng dưới/rốn; khuỷu sát thân; không giật lưng." },
        { title: "Hạ:", text: "Hạ có kiểm soát; giữ cột sống trung lập." },
      ],
    },
  },

  // One-arm Dumbbell Row
  {
    id: "one-arm-dumbbell-row",
    keywords: [/one\s*arm.*dumbbell\s*row/i, /\bonearm(db|[ -]?dumbbell)?\s*row\b/i],
    guide: {
      difficulty: "Mới bắt đầu – Trung cấp",
      exercise_type: "Accessory (Lat/Lưng giữa một bên)",
      log_type: "Tạ & Số lần lặp",
      equipment: "Tạ tay + ghế/điểm tựa",
      steps: [
        { title: "Tư thế:", text: "Một gối/một tay tựa ghế; lưng phẳng; vai không xoay mở." },
        { title: "Kéo:", text: "Kéo khuỷu về hông; tạ đi sát thân; không nhún vai lên tai." },
        { title: "Hạ:", text: "Thả tạ có kiểm soát, giữ căng cơ ở đáy." },
      ],
    },
  },

  // Seated Cable Row
  {
    id: "seated-cable-row",
    keywords: [/seated\s*cable\s*row/i, /\bcable\s*row\b/i],
    guide: {
      difficulty: "Mới bắt đầu – Trung cấp",
      exercise_type: "Accessory (Lưng giữa + Lat)",
      log_type: "Tạ & Số lần lặp",
      equipment: "Máy cáp ngồi + tay nắm chữ V/đơn",
      steps: [
        { title: "Chuẩn bị:", text: "Ngồi thẳng lưng; hơi gập gối; ngực mở; bả vai khoá nhẹ." },
        { title: "Kéo:", text: "Kéo tay nắm về gần rốn; khép scapula; không đổ người ra sau." },
        { title: "Hồi:", text: "Thả tay nắm theo đường thẳng; kiểm soát vai." },
      ],
    },
  },

  // Straight-arm Cable Pulldown
  {
    id: "straight-arm-cable-pulldown",
    keywords: [/straight\s*arm.*pulldown/i, /pulldown.*straight\s*arm/i],
    guide: {
      difficulty: "Mới bắt đầu – Trung cấp",
      exercise_type: "Isolation (Lat – vai duỗi)",
      log_type: "Tạ & Số lần lặp",
      equipment: "Máy cáp cao + thanh thẳng/dây",
      steps: [
        { title: "Chuẩn bị:", text: "Đứng cách cột; tay gần duỗi; ngực mở; lưng trung lập." },
        { title: "Kéo vòng cung:", text: "Khuỷu hơi gập; kéo thanh theo cung lớn về đùi; không gập khuỷu quá nhiều." },
        { title: "Hồi:", text: "Thả theo cung ngược lên trên; giữ Lat căng liên tục." },
      ],
    },
  },

  // Lying Cable Pullover
  {
    id: "lying-cable-pullover",
    keywords: [/lying\s*cable\s*pullover/i, /cable\s*lying\s*pullover/i, /\bpullover\b/i],
    guide: {
      difficulty: "Trung cấp",
      exercise_type: "Isolation/Accessory (Lat + ngực dưới mức nhẹ)",
      log_type: "Tạ & Số lần lặp",
      equipment: "Máy cáp + ghế/nằm",
      steps: [
        { title: "Set up:", text: "Pulley thấp–trung; tay cầm/rope; lưng ghế ổn định." },
        { title: "Quỹ đạo:", text: "Giữ khuỷu hơi gập, kéo vòng cung từ trên đầu về ngang ngực/bụng trên." },
        { title: "Kiểm soát:", text: "Không bẻ cổ tay; không biến thành pulldown bằng khuỷu." },
      ],
    },
  },

  // Archer Pull-up
  {
    id: "archer-pull-up",
    keywords: [/archer.*pull\s*up/i, /archer.*chin\s*up/i, /\barcher\b/i],
    guide: {
      difficulty: "Nâng cao",
      exercise_type: "Bodyweight (đơn tay lệch – Lat & lưng giữa)",
      log_type: "Số lần lặp",
      equipment: "Xà đơn",
      steps: [
        { title: "Chuẩn bị:", text: "Hai tay rộng; vai hạ; core siết." },
        { title: "Kéo lệch:", text: "Kéo về một bên như kéo cung; tay còn lại duỗi; đổi bên mỗi lần." },
        { title: "Hạ:", text: "Hạ chậm, giữ cân bằng; tránh xoay hông." },
      ],
    },
  },

  // Side-to-side Chin-up
  {
    id: "side-to-side-chin-up",
    keywords: [/side\s*to\s*side.*chin\s*up/i, /\bsidetosidechin(up)?\b/i],
    guide: {
      difficulty: "Nâng cao",
      exercise_type: "Bodyweight biến thể (Lat + tay trước)",
      log_type: "Số lần lặp",
      equipment: "Xà đơn",
      steps: [
        { title: "Chuẩn bị:", text: "Nắm tay ngửa bằng vai; vai hạ; core siết." },
        { title: "Di chuyển:", text: "Kéo lên và chuyển cằm qua trái–phải luân phiên; giữ ngực mở." },
        { title: "Hạ:", text: "Trở lại giữa rồi hạ; không rung lắc quá mức." },
      ],
    },
  },

  // ================== CƠ THANG / TRAPEZIUS ==================

  // Band / DB Shrug (Upper trap)
  {
    id: "band-shrug",
    keywords: [/\bshrug\b/i, /band\s*shrug/i, /dumbbell\s*shrug/i, /\bdb\s*shrug\b/i],
    guide: {
      difficulty: "Mới bắt đầu – Trung cấp",
      exercise_type: "Accessory (Thang trên)",
      log_type: "Số lần lặp / Thời gian giữ đỉnh",
      equipment: "Dây kháng lực hoặc tạ tay",
      steps: [
        { title: "Chuẩn bị:", text: "Đứng thẳng; tay thả tự nhiên; bả vai thả lỏng." },
        { title: "Nâng vai:", text: "Kéo vai lên theo phương thẳng đứng; không xoay tròn vai; khuỷu thẳng." },
        { title: "Giữ đỉnh:", text: "Giữ 1–2 giây siết cơ thang." },
        { title: "Hạ xuống:", text: "Hạ chậm có kiểm soát." },
      ],
    },
  },

  // Cable Supine Reverse Fly (Mid/low trap + rear delt)
  {
    id: "cable-supine-reverse-fly",
    keywords: [/cable.*supine.*reverse.*fly/i, /reverse\s*fly/i],
    guide: {
      difficulty: "Trung cấp",
      exercise_type: "Isolation (Thang giữa/dưới + vai sau)",
      log_type: "Tạ & Số lần lặp",
      equipment: "Máy cáp",
      steps: [
        { title: "Thiết lập:", text: "Nằm ngửa/ghế nghiêng; pulley thấp–trung; tay hơi gập." },
        { title: "Dang tay:", text: "Dang theo hình cung; kéo bằng bả vai (retract & depress); không nhún vai." },
        { title: "Đỉnh:", text: "Giữ 1 giây; ngực mở." },
        { title: "Hạ:", text: "Hạ theo cung ngược; giữ căng cơ." },
      ],
    },
  },

  // Dumbbell Incline T-Raise (Mid/low trap)
  {
    id: "dumbbell-incline-t-raise",
    keywords: [/incline.*t[-\s]*raise/i],
    guide: {
      difficulty: "Trung cấp",
      exercise_type: "Accessory (Ổn định scapula – thang giữa/dưới)",
      log_type: "Số lần lặp",
      equipment: "Ghế nghiêng + tạ tay nhẹ",
      steps: [
        { title: "Chuẩn bị:", text: "Nằm sấp trên ghế nghiêng; tay gần duỗi." },
        { title: "Nâng T:", text: "Nâng tay sang ngang tạo chữ T; bả vai kéo về sau–xuống." },
        { title: "Kiểm soát:", text: "Cổ trung lập; không nhấc tạ quá cao làm gập lưng." },
        { title: "Hạ:", text: "Hạ chậm; giữ ổn định bả vai." },
      ],
    },
  },

  // Dumbbell Rotation Reverse Fly (Mid trap + ER)
  {
    id: "dumbbell-rotation-reverse-fly",
    keywords: [/rotation.*reverse.*fly/i, /reverse\s*fly.*rotation/i],
    guide: {
      difficulty: "Trung cấp",
      exercise_type: "Accessory (Thang giữa + rotator cuff)",
      log_type: "Số lần lặp",
      equipment: "Tạ tay",
      steps: [
        { title: "Dang tay:", text: "Dang tay ngang, xoay ngoài vai nhẹ ở đỉnh để kích hoạt ổn định." },
        { title: "Bả vai:", text: "Chuyển động từ scapula; tránh nhô vai." },
        { title: "Hạ:", text: "Hạ có kiểm soát; không vung tạ." },
      ],
    },
  },

  // Single-arm Overhead Carry (Upper trap + core)
  {
    id: "dumbbell-single-arm-overhead-carry",
    keywords: [/single\s*arm.*overhead.*carry/i, /overhead.*carry/i],
    guide: {
      difficulty: "Trung cấp",
      exercise_type: "Stability (Thang trên + core)",
      log_type: "Thời gian / quãng đường",
      equipment: "Tạ tay/kettlebell",
      steps: [
        { title: "Thiết lập:", text: "Đưa tạ lên thẳng tay; xương sườn hạ; core/mông siết." },
        { title: "Di chuyển:", text: "Bước đi chậm, vai giữ ổn định; tránh ưỡn lưng." },
        { title: "Thời lượng:", text: "Mỗi bên 20–40m hoặc 20–40s; đổi tay." },
      ],
    },
  },
  {
    id: "barbell-stiff-leg-good-morning",
    keywords: [/barbell.*stiff.*leg.*good.*morning/i, /good.*morning/i],
    guide: {
      difficulty: "Trung cấp",
      exercise_type: "Compound (Cột sống – Gáy lưng + gân kheo)",
      log_type: "Tạ & Số lần lặp",
      equipment: "Tạ đòn",
      steps: [
        { title: "Setup:", text: "Thanh đặt sau vai; chân rộng bằng vai; đầu nhìn trước." },
        { title: "Hạ:", text: "Gập hông về sau (hinge); lưng giữ phẳng; hạ tới khi cảm nhận căng gân kheo." },
        { title: "Nâng lên:", text: "Siết cơ lưng dưới và mông đẩy hông về trước để trở lại." },
        { title: "Lưu ý:", text: "Không cong lưng; không hạ sâu quá khả năng kiểm soát." },
      ],
    },
  },

  // Band / Dumbbell Stiff-leg Deadlift
  {
    id: "band-stiff-leg-deadlift",
    keywords: [/stiff.*leg.*deadlift/i, /band.*deadlift/i, /dumbbell.*stiff.*leg/i],
    guide: {
      difficulty: "Mới bắt đầu – Trung cấp",
      exercise_type: "Compound (Gáy lưng + gân kheo)",
      log_type: "Tạ & Số lần lặp",
      equipment: "Tạ đòn / tạ tay / dây kháng lực",
      steps: [
        { title: "Tư thế:", text: "Đứng rộng bằng vai; đầu gối hơi gập; giữ cột sống trung lập." },
        { title: "Hạ:", text: "Đẩy hông ra sau, lưng phẳng; tạ trượt gần chân; cảm nhận căng gân kheo." },
        { title: "Nâng:", text: "Siết mông và lưng dưới để kéo hông về vị trí ban đầu." },
      ],
    },
  },

  // Dumbbell Single-leg Deadlift
  {
    id: "dumbbell-single-leg-deadlift",
    keywords: [/single\s*leg.*deadlift/i, /one\s*leg.*deadlift/i],
    guide: {
      difficulty: "Trung cấp",
      exercise_type: "Balance + Compound (Lưng dưới + gân kheo + core)",
      log_type: "Tạ & Số lần lặp mỗi chân",
      equipment: "Tạ tay",
      steps: [
        { title: "Chuẩn bị:", text: "Đứng 1 chân; lưng thẳng; tay cầm tạ đối bên." },
        { title: "Hạ:", text: "Đẩy hông ra sau; chân còn lại duỗi thẳng ra sau; lưng song song sàn." },
        { title: "Nâng:", text: "Siết mông–lưng dưới để kéo hông về trung tâm; giữ thăng bằng." },
      ],
    },
  },

  // Hyperextension on Bench
  {
    id: "hyperextension-on-bench",
    keywords: [/hyperextension/i, /back\s*extension/i],
    guide: {
      difficulty: "Mới bắt đầu – Trung cấp",
      exercise_type: "Isolation (Lưng dưới)",
      log_type: "Số lần lặp / Thời gian giữ",
      equipment: "Ghế Roman bench hoặc sàn",
      steps: [
        { title: "Setup:", text: "Chỉnh pad ngang hông; chân cố định; tay đặt sau đầu hoặc trước ngực." },
        { title: "Hạ người:", text: "Hạ lưng tới gần vuông góc sàn; không gập quá sâu." },
        { title: "Nâng:", text: "Siết lưng dưới nâng thân lên đến khi thẳng trục; không ưỡn quá cao." },
      ],
    },
  },

  // Reverse Hyperextension
  {
    id: "reverse-hyper-extension-on-stability-ball",
    keywords: [/reverse.*hyper.*extension/i],
    guide: {
      difficulty: "Trung cấp",
      exercise_type: "Accessory (Mông + Lưng dưới)",
      log_type: "Số lần lặp",
      equipment: "Ghế Roman hoặc bóng tập",
      steps: [
        { title: "Setup:", text: "Nằm sấp, hông ở mép ghế; chân duỗi thẳng, giữ cứng core." },
        { title: "Nâng chân:", text: "Nâng chân lên cao tới song song sàn; siết mông–lưng dưới." },
        { title: "Hạ chân:", text: "Hạ chậm tới gần vuông góc sàn; không để rơi tự do." },
      ],
    },
  },

  // Cable Standing Lift
  {
    id: "cable-standing-lift",
    keywords: [/cable\s*standing\s*lift/i, /standing\s*lift/i],
    guide: {
      difficulty: "Trung cấp",
      exercise_type: "Functional (Gáy lưng + core xoay)",
      log_type: "Tạ & Số lần lặp",
      equipment: "Máy cáp thấp + tay cầm đơn",
      steps: [
        { title: "Setup:", text: "Đứng lệch 45° với cột cáp; tay cầm ở thấp." },
        { title: "Kéo lên:", text: "Xoay thân và kéo cáp chéo lên trên qua vai đối diện; giữ core siết." },
        { title: "Hạ:", text: "Hạ chậm về vị trí cũ; không xoay hông quá mức." },
      ],
    },
  },

  // Weighted Front Plank
  {
    id: "weighted-front-plank",
    keywords: [/weighted.*front.*plank/i, /front.*plank/i],
    guide: {
      difficulty: "Trung cấp",
      exercise_type: "Stability (Lưng + core trước/sau)",
      log_type: "Thời gian giữ / Trọng lượng thêm",
      equipment: "Tạ đĩa hoặc bodyweight",
      steps: [
        { title: "Setup:", text: "Chống cẳng tay hoặc tay; vai–hông–gót chân trên một đường thẳng." },
        { title: "Giữ:", text: "Siết core, glute, lưng dưới; giữ cố định 20–60s." },
        { title: "Thêm tải:", text: "Có thể đặt tạ lên lưng nếu kiểm soát tốt." },
      ],
    },
  },

  // Sphinx / Cobra Stretch
  {
    id: "sphinx",
    keywords: [/\bsphinx\b/i, /cobra.*pose/i, /lumbar.*stretch/i],
    guide: {
      difficulty: "Mới bắt đầu",
      exercise_type: "Stretch (Giãn cột sống thắt lưng)",
      log_type: "Thời gian giữ",
      equipment: "Thảm tập",
      steps: [
        { title: "Setup:", text: "Nằm sấp, khuỷu chống dưới vai, lòng bàn tay úp." },
        { title: "Thực hiện:", text: "Nhẹ nhàng ưỡn ngực lên; vai hạ; giữ 15–30 giây; thở đều." },
        { title: "Tác dụng:", text: "Giãn cơ lưng dưới và cơ bụng sâu." },
      ],
    },
  },
  
];
/** ================== GUIDES VAI (CƠ VAI SAU) ================== */
const SHOULDER_GUIDES = [
  // Cable Rear Pulldown (Rear delt bias)
  {
    id: "cable-rear-pulldown",
    keywords: [/cable\s*rear\s*pulldown/i, /\brear\s*pulldown\b/i],
    guide: {
      difficulty: "Mới bắt đầu – Trung cấp",
      exercise_type: "Isolation (Vai sau + xô trên nhẹ)",
      log_type: "Tạ & Số lần lặp",
      equipment: "Máy cáp cao + tay nắm",
      steps: [
        { title: "Chuẩn bị:", text: "Nắm tay vừa; ngực mở; bả vai hạ xuống." },
        { title: "Kéo:", text: "Kéo khuỷu ra sau theo đường chéo, cảm nhận vai sau; không nhô vai." },
        { title: "Đỉnh:", text: "Giữ 1 giây siết vai sau; cổ trung lập." },
        { title: "Hồi:", text: "Thả có kiểm soát; giữ căng cơ liên tục." },
      ],
    },
  },

  // Cable Cross-over Lateral Pulldown (rear/upper-back)
  {
    id: "cable-cross-over-lateral-pulldown",
    keywords: [/cable.*cross.*over.*lateral.*pulldown/i],
    guide: {
      difficulty: "Trung cấp",
      exercise_type: "Isolation (Vai sau + lưng trên)",
      log_type: "Tạ & Số lần lặp",
      equipment: "Cáp đôi, pulley cao",
      steps: [
        { title: "Setup:", text: "Đứng giữa 2 cột; tay bắt chéo hình X; thân hơi nghiêng." },
        { title: "Kéo chéo:", text: "Kéo khuỷu về sau–xuống tạo đường chéo; không nhấc vai lên tai." },
        { title: "Đỉnh:", text: "Giữ ngắn 1 giây; siết vai sau/lưng trên." },
        { title: "Hồi:", text: "Trả tay chậm theo đường chéo ngược." },
      ],
    },
  },

  // Cable Standing Cross-over High Reverse (rear delt fly pattern)
  {
    id: "cable-standing-cross-over-high-reverse",
    keywords: [/cable.*standing.*cross.*over.*high.*reverse/i, /high\s*reverse/i],
    guide: {
      difficulty: "Mới bắt đầu – Trung cấp",
      exercise_type: "Isolation (Reverse fly – vai sau)",
      log_type: "Tạ & Số lần lặp",
      equipment: "Cáp đôi, pulley cao",
      steps: [
        { title: "Chuẩn bị:", text: "Tay bắt chéo; khuỷu hơi gập; ngực mở." },
        { title: "Dang ngược:", text: "Dang tay mở ra sau theo cung; kéo từ bả vai (retract)." },
        { title: "Đỉnh:", text: "Giữ 1 giây; không xoay thân." },
        { title: "Hồi:", text: "Hạ theo cung; giữ kiểm soát." },
      ],
    },
  },

  // Cable Seated High Row V-bar (upper-back / rear delts)
  {
    id: "cable-seated-high-row-v-bar",
    keywords: [/cable.*seated.*high.*row.*v.*bar/i, /high\s*row/i],
    guide: {
      difficulty: "Mới bắt đầu – Trung cấp",
      exercise_type: "Accessory (Lưng trên + vai sau)",
      log_type: "Tạ & Số lần lặp",
      equipment: "Máy kéo cáp + tay nắm V",
      steps: [
        { title: "Setup:", text: "Ghế cố định; ngực mở; bả vai khoá nhẹ." },
        { title: "Kéo cao:", text: "Kéo về ngực trên; khuỷu đi ngang; cảm nhận vai sau." },
        { title: "Hồi:", text: "Thả có kiểm soát; không ngửa ra sau quá mức." },
      ],
    },
  },

  // Lever High Row (machine)
  {
    id: "lever-high-row",
    keywords: [/lever.*high.*row/i, /\bhigh\s*row\b/i],
    guide: {
      difficulty: "Mới bắt đầu – Trung cấp",
      exercise_type: "Sức mạnh (Máy – lưng trên/ rear delts)",
      log_type: "Tạ & Số lần lặp",
      equipment: "Máy High Row",
      steps: [
        { title: "Chuẩn bị:", text: "Chỉnh ghế/đệm; tay nắm vừa; ngực tựa pad nếu có." },
        { title: "Kéo:", text: "Kéo khuỷu ra sau–ra ngoài; không nhún vai." },
        { title: "Đỉnh:", text: "Giữ siết ngắn; cổ trung lập." },
        { title: "Hạ:", text: "Theo quỹ đạo máy; kiểm soát hoàn toàn." },
      ],
    },
  },

  // Lever Reverse-grip Lateral Pulldown (rear-biased)
  {
    id: "lever-reverse-grip-lateral-pulldown",
    keywords: [/lever.*reverse.*grip.*lateral.*pulldown/i, /reverse.*grip.*lateral.*pulldown/i],
    guide: {
      difficulty: "Trung cấp",
      exercise_type: "Isolation (Vai sau + lưng trên)",
      log_type: "Tạ & Số lần lặp",
      equipment: "Máy/ cáp cao tay nắm ngửa",
      steps: [
        { title: "Setup:", text: "Nắm ngửa hẹp–vừa; ngực mở; bả vai hạ." },
        { title: "Kéo:", text: "Kéo khuỷu về sau–ra ngoài; tập trung vai sau." },
        { title: "Hồi:", text: "Thả chậm; không rút vai lên tai." },
      ],
    },
  },

  // Smith Narrow Row (upper-back / rear delts focus)
  {
    id: "smith-narrow-row",
    keywords: [/smith.*narrow.*row/i],
    guide: {
      difficulty: "Trung cấp",
      exercise_type: "Accessory (Lưng trên + vai sau)",
      log_type: "Tạ & Số lần lặp",
      equipment: "Smith machine",
      steps: [
        { title: "Chuẩn bị:", text: "Thanh ngang bụng trên; nắm hẹp–vừa; lưng phẳng." },
        { title: "Kéo:", text: "Kéo về ngực trên; khuỷu đi ngang; không bẩy lưng." },
        { title: "Hạ:", text: "Hạ chậm; bả vai kiểm soát." },
      ],
    },
  },

  // Twin-handle Parallel-grip Lat Pulldown (rear/upper)
  {
    id: "twin-handle-parallel-grip-lat-pulldown",
    keywords: [/twin.*handle.*parallel.*grip.*lat.*pulldown/i, /parallel.*grip.*pulldown/i],
    guide: {
      difficulty: "Mới bắt đầu – Trung cấp",
      exercise_type: "Accessory (Lưng trên + vai sau)",
      log_type: "Tạ & Số lần lặp",
      equipment: "Máy cáp cao + tay nắm đôi song song",
      steps: [
        { title: "Setup:", text: "Đệm đùi cố định; nắm song song." },
        { title: "Kéo:", text: "Kéo khuỷu xuống–ra sau; giữ ngực mở." },
        { title: "Hồi:", text: "Thả chậm; không nhô vai." },
      ],
    },
  },

  // Gironda Sternum Chin (upper back + rear delts)
  {
    id: "gironda-sternum-chin",
    keywords: [/gironda.*sternum.*chin/i],
    guide: {
      difficulty: "Nâng cao",
      exercise_type: "Bodyweight biến thể (Lưng trên + vai sau)",
      log_type: "Số lần lặp",
      equipment: "Xà đơn",
      steps: [
        { title: "Động tác:", text: "Kéo lên với ngực hướng vào xà (sternum), lưng ngửa nhẹ; khuỷu đi ngang." },
        { title: "Kiểm soát:", text: "Không vung người; giữ bả vai hạ & khép." },
      ],
    },
  },
  // Rotator cuff – Cable seated IR
{
  id: "cable-seated-shoulder-internal-rotation",
  keywords: [/cable.*seated.*internal.*rotation/i, /\bshoulder.*internal.*rotation\b/i, /\bIR\b/i],
  guide: {
    difficulty: "Mới bắt đầu – Trung cấp",
    exercise_type: "Isolation (Rotator cuff – xoay trong)",
    log_type: "Tạ & Số lần lặp",
    equipment: "Máy cáp thấp + tay cầm đơn, ghế",
    steps: [
      { title: "Setup:", text: "Ngồi cạnh cột cáp; khuỷu gập ~90°, kẹp sát sườn; pulley ngang cổ tay." },
      { title: "Xoay trong:", text: "Kéo cáp xoay cẳng tay vào trong tới trước bụng; vai thư giãn, không nhún." },
      { title: "Hồi:", text: "Thả chậm về vị trí ban đầu; giữ khuỷu cố định." },
      { title: "Gợi ý:", text: "Có thể kẹp khăn nhỏ giữa khuỷu & sườn để giữ ổn định." },
    ],
  },
},

// Rotator cuff – DB lying ER
{
  id: "dumbbell-lying-external-shoulder-rotation",
  keywords: [/dumbbell.*lying.*external.*rotation/i, /\bshoulder.*external.*rotation\b/i, /\bER\b/i],
  guide: {
    difficulty: "Mới bắt đầu – Trung cấp",
    exercise_type: "Isolation (Rotator cuff – xoay ngoài)",
    log_type: "Tạ & Số lần lặp",
    equipment: "Tạ tay nhẹ + ghế/nghiêng",
    steps: [
      { title: "Tư thế:", text: "Nằm nghiêng; khuỷu gập 90° kẹp sát sườn; cổ tay trung lập." },
      { title: "Xoay ngoài:", text: "Xoay cẳng tay nâng tạ lên; dừng khi vai không nhô; kiểm soát scapula." },
      { title: "Hạ:", text: "Hạ chậm; không để rơi tạ." },
      { title: "Tải:", text: "Dùng tạ rất nhẹ, ưu tiên kiểm soát & cảm nhận." },
    ],
  },
},

// Rotator cuff – Prone DB upright ER
{
  id: "prone-dumbbell-upright-shoulder-external-rotation",
  keywords: [/prone.*dumbbell.*external.*rotation/i, /upright.*external.*rotation/i],
  guide: {
    difficulty: "Trung cấp",
    exercise_type: "Isolation/Stability (Rotator cuff + kiểm soát bả vai)",
    log_type: "Tạ & Số lần lặp",
    equipment: "Tạ tay nhẹ + ghế phẳng",
    steps: [
      { title: "Setup:", text: "Nằm sấp; cánh tay giang ngang 90° (chữ T); khuỷu gập 90°." },
      { title: "Xoay ngoài:", text: "Xoay ngoài để đưa bàn tay lên (forearm vuông góc sàn); vai giữ hạ–khép nhẹ." },
      { title: "Hồi:", text: "Hạ chậm theo cung xoay; không di chuyển cánh tay." },
    ],
  },
},

// Lateral raise có hỗ trợ (giảm cheat)
{
  id: "dumbbell-one-arm-lateral-raise-with-support",
  keywords: [/dumbbell.*one.*arm.*lateral.*raise.*support/i, /\blateral.*raise\b.*support/i],
  guide: {
    difficulty: "Mới bắt đầu – Trung cấp",
    exercise_type: "Isolation (Vai giữa – hạn chế đu người)",
    log_type: "Tạ & Số lần lặp",
    equipment: "Tạ tay + ghế/điểm tựa",
    steps: [
      { title: "Setup:", text: "Tựa tay rảnh vào ghế/cột; người hơi nghiêng về bên làm." },
      { title: "Nâng ngang:", text: "Nâng tạ sang ngang tới ngang vai; khuỷu hơi gập; cổ tay trung lập." },
      { title: "Hạ:", text: "Hạ chậm; giữ căng cơ ở đáy; không vung." },
      { title: "Mẹo:", text: "Thổi ra ở 1/3 trên; giữ vai tránh nhún lên tai." },
    ],
  },
},

];
const BICEPS_GUIDES = [
  // DB Incline Biceps Curl
  {
    id: "dumbbell-incline-biceps-curl",
    keywords: [/dumbbell.*incline.*biceps.*curl/i, /\bincline.*curl\b/i],
    guide: {
      difficulty: "Mới bắt đầu – Trung cấp",
      exercise_type: "Isolation (Biceps – long head stretch)",
      log_type: "Tạ & Số lần lặp",
      equipment: "Ghế incline + tạ tay",
      steps: [
        { title: "Setup:", text: "Tựa lưng ghế 30–45°; tay thả dọc; vai mở nhẹ." },
        { title: "Cuốn:", text: "Giữ khuỷu cố định; cuốn tạ lên đến gần vai; cổ tay hơi ngửa (supinate)." },
        { title: "Hạ:", text: "Hạ chậm hết biên độ; cảm nhận kéo giãn đầu dài." },
      ],
    },
  },

  // DB Seated Inner Biceps Curl (cross-body)
  {
    id: "dumbbell-seated-inner-biceps-curl",
    keywords: [/seated.*inner.*biceps.*curl/i, /inner.*curl/i],
    guide: {
      difficulty: "Mới bắt đầu – Trung cấp",
      exercise_type: "Isolation (Biceps – bias short head)",
      log_type: "Tạ & Số lần lặp",
      equipment: "Ghế + tạ tay",
      steps: [
        { title: "Tư thế:", text: "Ngồi thẳng; khuỷu sát thân." },
        { title: "Cuốn trong:", text: "Cuốn chéo về phía trong (gần ngực); xoay ngửa cổ tay ở đỉnh." },
        { title: "Hạ:", text: "Hạ có kiểm soát; không vung vai." },
      ],
    },
  },

  // DB Hammer Curls with Arm Blaster
  {
    id: "dumbbell-hammer-curls-with-arm-blaster",
    keywords: [/hammer.*curls?.*arm.*blaster/i, /\bhammer\s*curl\b/i],
    guide: {
      difficulty: "Mới bắt đầu – Trung cấp",
      exercise_type: "Isolation (Brachialis + Brachioradialis)",
      log_type: "Tạ & Số lần lặp",
      equipment: "Tạ tay + arm blaster (tuỳ chọn)",
      steps: [
        { title: "Setup:", text: "Khuỷu kẹp sát; nắm trung lập (ngón cái hướng lên)." },
        { title: "Cuốn:", text: "Cuốn thẳng lên không nhấc khuỷu; giữ thân ổn định." },
        { title: "Hạ:", text: "Hạ chậm; dừng ngắn dưới để loại trừ bật nảy." },
      ],
    },
  },

  // Cable Reverse One-arm Curl
  {
    id: "cable-reverse-one-arm-curl",
    keywords: [/cable.*reverse.*one.*arm.*curl/i, /\breverse.*curl\b/i],
    guide: {
      difficulty: "Mới bắt đầu – Trung cấp",
      exercise_type: "Isolation (Biceps/brachialis + cẳng tay)",
      log_type: "Tạ & Số lần lặp",
      equipment: "Cáp thấp + tay cầm đơn",
      steps: [
        { title: "Tư thế:", text: "Đứng thẳng; tay nắm sấp (pronated); khuỷu sát thân." },
        { title: "Cuốn ngửa sấp:", text: "Cuốn cẳng tay lên; không gập cổ tay; vai thư giãn." },
        { title: "Hạ:", text: "Hạ có kiểm soát; giữ căng cơ liên tục." },
      ],
    },
  },

  // Barbell Wrist Curl (forearm accessory)
  {
    id: "barbell-wrist-curl",
    keywords: [/barbell.*wrist.*curl/i, /\bwrist.*curl\b/i],
    guide: {
      difficulty: "Mới bắt đầu",
      exercise_type: "Accessory (Cẳng tay – flexor)",
      log_type: "Tạ & Số lần lặp",
      equipment: "Tạ đòn/ez-bar",
      steps: [
        { title: "Setup:", text: "Ngồi; cẳng tay đặt trên đùi/ghế; cổ tay nhô ra mép." },
        { title: "Gập cổ tay:", text: "Gập cổ tay nâng đòn; không cuộn cả cẳng tay." },
        { title: "Hạ:", text: "Hạ sâu để kéo giãn; kiểm soát hoàn toàn." },
      ],
    },
  },

  // DB Seated Biceps Curl to Shoulder Press (combo)
  {
    id: "dumbbell-seated-biceps-curl-to-shoulder-press",
    keywords: [/seated.*biceps.*curl.*to.*shoulder.*press/i, /curl.*to.*press/i],
    guide: {
      difficulty: "Trung cấp",
      exercise_type: "Combo (Biceps → Vai trước)",
      log_type: "Tạ & Số lần lặp",
      equipment: "Ghế + tạ tay",
      steps: [
        { title: "Bước 1:", text: "Cuốn tạ lên, giữ khuỷu cố định." },
        { title: "Bước 2:", text: "Xoay cổ tay và đẩy qua đầu thành shoulder press." },
        { title: "Hạ:", text: "Hạ về vai rồi mở khuỷu trả về vị trí ban đầu." },
      ],
    },
  },

  // Inverted Row (bent knees) – bodyweight pull bias biceps
  {
    id: "inverted-row-bent-knees",
    keywords: [/inverted.*row.*bent.*knees/i, /\binverted\s*row\b/i],
    guide: {
      difficulty: "Mới bắt đầu – Trung cấp",
      exercise_type: "Bodyweight (Kéo – lưng trên + biceps)",
      log_type: "Số lần lặp",
      equipment: "Thanh xà thấp/Smith",
      steps: [
        { title: "Setup:", text: "Nằm dưới thanh; gối gập; thân thẳng; nắm rộng bằng vai." },
        { title: "Kéo:", text: "Kéo ngực chạm/tiệm cận thanh; khuỷu đi ngang, bả vai khép." },
        { title: "Hạ:", text: "Hạ chậm; vẫn giữ thân thẳng." },
      ],
    },
  },

  // Kettlebell Double Alternating Hang Clean – (power + biceps isometric)
  {
    id: "kettlebell-double-alternating-hang-clean",
    keywords: [/kettlebell.*double.*alternating.*hang.*clean/i, /\bhang\s*clean\b/i],
    guide: {
      difficulty: "Trung cấp – Nâng cao",
      exercise_type: "Power/Conditioning (chain trước + biceps isometric)",
      log_type: "Số lần lặp / thời gian",
      equipment: "2 kettlebell (hoặc 1 KB luân phiên)",
      steps: [
        { title: "Đà hông:", text: "Hike pass KB; dùng hông búng lên; giữ lưng trung lập." },
        { title: "Catch rack:", text: "Bắt KB ở rack từng bên luân phiên; khuỷu thấp vừa; cổ tay trung lập." },
        { title: "Hạ:", text: "Thả về giữa đùi theo quỹ đạo cánh tay; nhịp thở đều." },
      ],
    },
  },
];
/** ================== GUIDES CORE (OBLIQUES / ANTI-ROTATION / CRUNCH) ================== */
const CORE_GUIDES = [
  // Band Horizontal Pallof Press (anti-rotation)
  {
    id: "band-horizontal-pallof-press",
    keywords: [/pallof\s*press/i, /band.*horizontal.*pallof/i],
    guide: {
      difficulty: "Mới bắt đầu – Trung cấp",
      exercise_type: "Anti-rotation (Core/Obliques)",
      log_type: "Thời gian / Số lần lặp",
      equipment: "Dây kháng lực hoặc cáp",
      steps: [
        { title: "Setup:", text: "Đứng ngang cột cáp/dây; hai tay ôm sát trước ngực; core siết." },
        { title: "Đẩy ra:", text: "Đẩy tay thẳng ra trước, chống xoay; giữ hông/vai vuông góc." },
        { title: "Giữ & về:", text: "Giữ 1–2s ở xa; kéo về trước ngực có kiểm soát." },
      ],
    },
  },

  // Bodyweight Incline Side Plank
  {
    id: "bodyweight-incline-side-plank",
    keywords: [/incline.*side.*plank/i, /side\s*plank/i],
    guide: {
      difficulty: "Mới bắt đầu",
      exercise_type: "Anti-lateral flexion (Obliques)",
      log_type: "Thời gian giữ",
      equipment: "Thảm/ghế/kê tay",
      steps: [
        { title: "Tư thế:", text: "Chống tay/cẳng tay trên ghế cao; thân thẳng; hông không rơi." },
        { title: "Giữ:", text: "Siết cơ chéo bụng; giữ hơi thở đều 20–45s/bên." },
        { title: "Tiến độ:", text: "Thấp dần điểm tựa → cẳng tay trên sàn để tăng khó." },
      ],
    },
  },

  // Bottoms-up (KB bottoms up carry/hold) – core ổn định
  {
    id: "bottoms-up",
    keywords: [/bottoms.*up/i],
    guide: {
      difficulty: "Trung cấp",
      exercise_type: "Stability (Core/Obliques + cổ tay)",
      log_type: "Thời gian / Quãng đường",
      equipment: "Kettlebell",
      steps: [
        { title: "Thiết lập:", text: "Giữ kettlebell đáy lên; cổ tay trung lập; vai hạ." },
        { title: "Giữ/di chuyển:", text: "Bước đi hoặc giữ đứng; chống nghiêng & xoay." },
        { title: "An toàn:", text: "Chọn tạ vừa; tránh gập cổ tay; mắt nhìn trước." },
      ],
    },
  },

  // Lever Seated Crunch
  {
    id: "lever-seated-crunch",
    keywords: [/lever.*seated.*crunch/i, /machine.*crunch/i],
    guide: {
      difficulty: "Mới bắt đầu – Trung cấp",
      exercise_type: "Flexion (Rectus Abdominis)",
      log_type: "Tạ & Số lần lặp",
      equipment: "Máy/Lever Crunch",
      steps: [
        { title: "Setup:", text: "Chỉnh ghế/đệm; ôm tay nắm; lưng dưới áp pad." },
        { title: "Gập bụng:", text: "Cuộn cột sống từ trên xuống; thở ra khi gập." },
        { title: "Hạ:", text: "Trả về chậm; không duỗi quá sâu lưng dưới." },
      ],
    },
  },

  // Weighted Crunch
  {
    id: "weighted-crunch",
    keywords: [/weighted.*crunch/i, /\bcrunch\b/i],
    guide: {
      difficulty: "Mới bắt đầu",
      exercise_type: "Flexion (Rectus Abdominis)",
      log_type: "Tạ & Số lần lặp / Thời gian",
      equipment: "Đĩa tạ/tạ tay/thảm",
      steps: [
        { title: "Tư thế:", text: "Nằm ngửa, gối gập; đĩa tạ trước ngực hoặc trên trán." },
        { title: "Gập:", text: "Nhấc đầu–vai khỏi sàn, cuộn bụng; không giật cổ." },
        { title: "Hạ:", text: "Hạ có kiểm soát; giữ căng liên tục." },
      ],
    },
  },
  // Band Standing Crunch
{
  id: "band-standing-crunch",
  keywords: [/band\s*standing\s*crunch/i, /standing\s*crunch/i],
  guide: {
    difficulty: "Mới bắt đầu – Trung cấp",
    exercise_type: "Flexion (Cơ thẳng bụng)",
    log_type: "Tạ & Số lần lặp",
    equipment: "Dây kháng lực/cáp cao",
    steps: [
      { title: "Setup:", text: "Tay giữ dây ngang đầu; chân vững; core siết." },
      { title: "Gập bụng:", text: "Cuộn cột sống kéo khuỷu về đùi; không gập hông quá nhiều." },
      { title: "Hồi về:", text: "Trả chậm; tránh kéo bằng tay/cánh tay." },
    ],
  },
},

// Cable Seated Crunch
{
  id: "cable-seated-crunch",
  keywords: [/cable\s*seated\s*crunch/i, /seated\s*crunch/i],
  guide: {
    difficulty: "Mới bắt đầu – Trung cấp",
    exercise_type: "Flexion (Cơ thẳng bụng)",
    log_type: "Tạ & Số lần lặp",
    equipment: "Máy cáp + ghế",
    steps: [
      { title: "Tư thế:", text: "Ngồi thẳng, tay giữ dây gần đầu; lưng dưới áp pad (nếu có)." },
      { title: "Gập:", text: "Cuộn bụng từ trên xuống; thở ra mạnh ở đỉnh." },
      { title: "Hạ:", text: "Trả chậm; giữ căng cơ liên tục." },
    ],
  },
},

// Lever Seated Crunch
{
  id: "lever-seated-crunch",
  keywords: [/lever.*seated.*crunch/i, /machine.*crunch/i],
  guide: {
    difficulty: "Mới bắt đầu – Trung cấp",
    exercise_type: "Flexion (Cơ thẳng bụng)",
    log_type: "Tạ & Số lần lặp",
    equipment: "Máy/Lever Crunch",
    steps: [
      { title: "Setup:", text: "Chỉnh ghế/đệm; bám tay nắm; core siết." },
      { title: "Gập bụng:", text: "Cuộn cột sống, kéo thân về trước; không giật cổ." },
      { title: "Hạ:", text: "Hạ có kiểm soát; không duỗi quá sâu lưng dưới." },
    ],
  },
},

// Weighted Crunch
{
  id: "weighted-crunch",
  keywords: [/weighted.*crunch/i, /\bcrunch\b/i],
  guide: {
    difficulty: "Mới bắt đầu",
    exercise_type: "Flexion (Cơ thẳng bụng)",
    log_type: "Tạ & Số lần lặp / Thời gian",
    equipment: "Đĩa tạ / tạ tay / thảm",
    steps: [
      { title: "Tư thế:", text: "Nằm ngửa, gối gập; giữ tạ trước ngực/đỉnh đầu." },
      { title: "Gập:", text: "Nhấc đầu–vai khỏi sàn, cuộn bụng; không kéo cổ." },
      { title: "Hạ:", text: "Hạ chậm; vẫn giữ căng cơ." },
    ],
  },
},
// Scapula Push-up
{
  id: "scapula-push-up",
  keywords: [/scapula\s*push\s*up/i, /serratus/i],
  guide: {
    difficulty: "Mới bắt đầu",
    exercise_type: "Protraction/Retraction (Răng trước + ổn định vai)",
    log_type: "Số lần lặp / Thời gian",
    equipment: "Bodyweight",
    steps: [
      { title: "Setup:", text: "Plank cao; vai trên cổ tay; core/mông siết; khuỷu thẳng." },
      { title: "Protraction:", text: "Đẩy bả vai ra trước; ngực hạ xuống giữa hai tay." },
      { title: "Retraction:", text: "Kéo bả vai về sau; lặp lại, KHÔNG gập khuỷu." },
    ],
  },
},

// Incline Scapula Push-up (dễ)
{
  id: "incline-scapula-push-up",
  keywords: [/incline\s*scapula\s*push\s*up/i],
  guide: {
    difficulty: "Mới bắt đầu",
    exercise_type: "Serratus activation (dễ)",
    log_type: "Số lần lặp / Thời gian",
    equipment: "Bục/ghế/box",
    steps: [
      { title: "Tư thế:", text: "Tay tựa lên ghế; thân thẳng; core siết." },
      { title: "Động tác:", text: "Protraction–retraction qua bả vai; biên độ vừa đủ kiểm soát." },
      { title: "Tiến độ:", text: "Hạ dần độ cao ghế để tăng khó." },
    ],
  },
},

// High Style Scapula Push-up (khó hơn)
{
  id: "high-style-scapula-push-up",
  keywords: [/high\s*style\s*scapula\s*push\s*up/i],
  guide: {
    difficulty: "Trung cấp",
    exercise_type: "Serratus + kiểm soát scapula nâng cao",
    log_type: "Số lần lặp",
    equipment: "Bodyweight",
    steps: [
      { title: "Setup:", text: "Plank cao; tay xoay nhẹ ra ngoài; cổ trung lập." },
      { title: "Biên độ:", text: "Nhấn mạnh protraction ở đỉnh; hông không trôi." },
      { title: "Kiểm soát:", text: "Giữ khuỷu thẳng; chuyển động từ bả vai." },
    ],
  },
},

// Suspended Push-up (rings/TRX)
{
  id: "suspended-push-up",
  keywords: [/suspended\s*push\s*up/i],
  guide: {
    difficulty: "Trung cấp",
    exercise_type: "Stability (Răng trước + core)",
    log_type: "Số lần lặp",
    equipment: "Rings/TRX",
    steps: [
      { title: "Tư thế:", text: "Dây treo phù hợp; thân thẳng; core siết." },
      { title: "Đẩy:", text: "Giữ cổ tay & vai ổn định; nhấn protraction ở đỉnh." },
      { title: "An toàn:", text: "Hạn chế rung dây; từng nhịp chậm, kiểm soát." },
    ],
  },
},

// Incline Shoulder Raise (DB/BB) – serratus punch
{
  id: "dumbbell-incline-shoulder-raise",
  keywords: [/dumbbell\s*incline\s*shoulder\s*raise/i],
  guide: {
    difficulty: "Trung cấp",
    exercise_type: "Serratus punch",
    log_type: "Tạ & Số lần lặp",
    equipment: "Ghế dốc + tạ tay",
    steps: [
      { title: "Setup:", text: "Nằm ghế dốc 30–45°; tay gần duỗi trước ngực." },
      { title: "Punch:", text: "Đẩy tạ thêm vài cm bằng bả vai (protraction); khuỷu gần thẳng." },
      { title: "Hạ:", text: "Kéo bả vai về sau (retraction) có kiểm soát." },
    ],
  },
},
{
  id: "barbell-incline-shoulder-raise",
  keywords: [/barbell\s*incline\s*shoulder\s*raise/i],
  guide: {
    difficulty: "Trung cấp",
    exercise_type: "Serratus punch",
    log_type: "Tạ & Số lần lặp",
    equipment: "Ghế dốc + tạ đòn",
    steps: [
      { title: "Tư thế:", text: "Nằm ghế dốc; nắm đòn hẹp–vừa; tay gần duỗi." },
      { title: "Protraction:", text: "Đẩy đòn bằng bả vai ra trước; không gập khuỷu." },
      { title: "Hồi:", text: "Hạ về retraction có kiểm soát." },
    ],
  },
},

];
/** ================== GUIDES MÔNG (GLUTES) ================== */
const GLUTE_GUIDES = [
  {
    id: "lever-seated-hip-abduction",
    keywords: [/seated.*hip.*abduction/i, /lever.*hip.*abduction/i],
    guide: {
      difficulty: "Mới bắt đầu",
      exercise_type: "Isolation (Glute Med/Min)",
      log_type: "Tạ & Số lần lặp",
      equipment: "Máy/Lever Hip Abduction",
      steps: [
        { title: "Setup:", text: "Tựa lưng; chỉnh pad; giữ lưng thẳng." },
        { title: "Mở gối:", text: "Đẩy gối ra ngoài; không ngả người; core siết." },
        { title: "Hạ:", text: "Trả về chậm; giữ căng cơ." },
      ],
    },
  },
  {
    id: "resistance-band-seated-hip-abduction",
    keywords: [/band.*seated.*hip.*abduction/i],
    guide: {
      difficulty: "Mới bắt đầu",
      exercise_type: "Activation (Glute Med/Min)",
      log_type: "Số lần lặp",
      equipment: "Mini band",
      steps: [
        { title: "Tư thế:", text: "Ngồi thẳng; band quanh gối; bàn chân cố định." },
        { title: "Mở gối:", text: "Đẩy gối ra ngoài; hông không xoay." },
        { title: "Hạ:", text: "Trả chậm; không để band bật lại." },
      ],
    },
  },
  {
    id: "side-hip-abduction",
    keywords: [/side.*lying.*hip.*abduction/i, /side.*hip.*abduction/i],
    guide: {
      difficulty: "Mới bắt đầu",
      exercise_type: "Isolation (Glute Med/Min)",
      log_type: "Số lần lặp",
      equipment: "Thảm/band",
      steps: [
        { title: "Setup:", text: "Nằm nghiêng; hông chồng; mũi chân hơi chúc xuống." },
        { title: "Nâng:", text: "Nâng chân trên 30–45°; không xoay người." },
        { title: "Hạ:", text: "Hạ chậm; giữ căng cơ." },
      ],
    },
  },
  {
    id: "side-bridge-hip-abduction",
    keywords: [/side.*bridge.*hip.*abduction/i],
    guide: {
      difficulty: "Trung cấp",
      exercise_type: "Stability (Glute Med + core bên)",
      log_type: "Số lần lặp / thời gian",
      equipment: "Thảm/band",
      steps: [
        { title: "Tư thế:", text: "Side plank gối; hông thẳng hàng; core siết." },
        { title: "Abduct:", text: "Nâng gối trên ra ngoài; hông không rơi." },
        { title: "Hạ:", text: "Trả chậm; đổi bên." },
      ],
    },
  },
  {
    id: "straight-leg-outer-hip-abductor",
    keywords: [/straight.*leg.*outer.*hip.*abductor/i],
    guide: {
      difficulty: "Mới bắt đầu – Trung cấp",
      exercise_type: "Isolation (Glute Med/Min)",
      log_type: "Số lần lặp",
      equipment: "Máy/cáp/band",
      steps: [
        { title: "Tư thế:", text: "Đứng thẳng; nắm tay vịn; mũi chân chúc nhẹ vào trong." },
        { title: "Đẩy ngang:", text: "Đưa chân làm việc ra ngoài thẳng gối; không nghiêng người." },
        { title: "Hạ:", text: "Trả chậm; kiểm soát hông." },
      ],
    },
  },
  {
    id: "dumbbell-contralateral-forward-lunge",
    keywords: [/contralateral.*forward.*lunge/i],
    guide: {
      difficulty: "Trung cấp",
      exercise_type: "Unilateral (Glute Max + đùi trước)",
      log_type: "Tạ & Số lần lặp mỗi bên",
      equipment: "Tạ tay",
      steps: [
        { title: "Bước:", text: "Bước tới; thân hơi nghiêng; tạ ở tay đối bên chân trụ." },
        { title: "Đứng dậy:", text: "Đạp gót chân trước về lại; siết mông ở đỉnh." },
      ],
    },
  },
  {
    id: "dumbbell-single-leg-squat",
    keywords: [/single.*leg.*squat/i],
    guide: {
      difficulty: "Nâng cao",
      exercise_type: "Unilateral balance (Glute Max + đùi)",
      log_type: "Số lần lặp",
      equipment: "Tạ tay/box hỗ trợ",
      steps: [
        { title: "Setup:", text: "Đứng 1 chân; tay cầm tạ; dùng box nếu cần." },
        { title: "Xuống/Lên:", text: "Hạ có kiểm soát; đạp gót đứng dậy; gối thẳng hàng." },
      ],
    },
  },
];
/** ================== GUIDES FOREARM (Cẳng tay trước) ================== */
const FOREARM_GUIDES = [
  // Palms-down Wrist Curl over a Bench (extensors)
  {
    id: "barbell-palms-down-wrist-curl-over-a-bench",
    keywords: [/palms.*down.*wrist.*curl.*bench/i, /pronated.*wrist.*curl/i],
    guide: {
      difficulty: "Mới bắt đầu – Trung cấp",
      exercise_type: "Isolation (Cơ duỗi cổ tay – extensors)",
      log_type: "Tạ & Số lần lặp",
      equipment: "Tạ đòn + ghế",
      steps: [
        { title: "Setup:", text: "Ngồi; cẳng tay úp trên ghế, cổ tay nhô ra mép; nắm sấp (pronated)." },
        { title: "Duỗi cổ tay:", text: "Nâng đòn bằng duỗi cổ tay; giữ cẳng tay cố định, không nhấc khuỷu." },
        { title: "Hạ:", text: "Hạ chậm sâu để kéo giãn; tránh bật nảy." },
      ],
    },
  },

  // Reverse Wrist Curl (extensors)
  {
    id: "barbell-reverse-wrist-curl",
    keywords: [/reverse.*wrist.*curl/i, /barbell.*reverse.*wrist.*curl/i],
    guide: {
      difficulty: "Mới bắt đầu – Trung cấp",
      exercise_type: "Isolation (Extensors)",
      log_type: "Tạ & Số lần lặp",
      equipment: "Tạ đòn/EZ bar",
      steps: [
        { title: "Tư thế:", text: "Nắm sấp; cẳng tay đặt trên đùi/ghế; cổ tay ra mép." },
        { title: "Duỗi:", text: "Duỗi cổ tay nâng thanh; không lắc cẳng tay/nhún vai." },
        { title: "Hạ:", text: "Hạ có kiểm soát; nhịp 2–0–2." },
      ],
    },
  },

  // Reverse Wrist Curl v2 – file viết đúng (reverse)
  {
    id: "barbell-reverse-wrist-curl-v-2",
    keywords: [/reverse.*wrist.*curl.*v.*2/i],
    guide: {
      difficulty: "Mới bắt đầu – Trung cấp",
      exercise_type: "Isolation (Extensors)",
      log_type: "Tạ & Số lần lặp",
      equipment: "Tạ đòn/EZ bar",
      steps: [
        { title: "Setup:", text: "Tương tự reverse wrist curl; thay đổi biến thể/ghế." },
        { title: "Thực hiện:", text: "Duỗi cổ tay nâng thanh; giữ cẳng tay cố định." },
        { title: "Hạ:", text: "Hạ chậm; tránh bật nảy." },
      ],
    },
  },

  // Reverse Wrist Curl v2 – file viết thiếu chữ 'e' (revers)
  {
    id: "barbell-revers-wrist-curl-v-2",
    keywords: [/revers.*wrist.*curl.*v.*2/i],
    guide: {
      difficulty: "Mới bắt đầu – Trung cấp",
      exercise_type: "Isolation (Extensors)",
      log_type: "Tạ & Số lần lặp",
      equipment: "Tạ đòn/EZ bar",
      steps: [
        { title: "Lưu ý:", text: " Kỹ thuật giống reverse wrist curl v2." },
        { title: "Duỗi cổ tay:", text: "Duỗi cổ tay nâng thanh; không nhấc khuỷu." },
        { title: "Hạ:", text: "Hạ có kiểm soát; không bật nảy." },
      ],
    },
  },

  // Wrist Curl v2 (flexors – supinated)
  {
    id: "barbell-wrist-curl-v-2",
    keywords: [/wrist.*curl.*v.*2/i, /barbell.*wrist.*curl/i],
    guide: {
      difficulty: "Mới bắt đầu",
      exercise_type: "Isolation (Cơ gập cổ tay – flexors)",
      log_type: "Tạ & Số lần lặp",
      equipment: "Tạ đòn/EZ bar",
      steps: [
        { title: "Setup:", text: "Nắm ngửa (supinated); cẳng tay đặt trên đùi/ghế; cổ tay ra mép." },
        { title: "Gập cổ tay:", text: "Cuộn cổ tay nâng đòn; giữ ngón tay quanh đòn, không buông." },
        { title: "Hạ:", text: "Hạ sâu để kéo giãn; kiểm soát hoàn toàn." },
      ],
    },
  },

  // Cable Wrist Curl (có thể làm ngửa hoặc sấp)
  {
    id: "cable-wrist-curl",
    keywords: [/cable.*wrist.*curl/i],
    guide: {
      difficulty: "Mới bắt đầu – Trung cấp",
      exercise_type: "Isolation (Flexors hoặc Extensors tuỳ tay nắm)",
      log_type: "Tạ & Số lần lặp",
      equipment: "Máy cáp thấp + thanh thẳng/tay cầm",
      steps: [
        { title: "Setup:", text: "Chọn tay nắm ngửa (flexor) hoặc sấp (extensor); cố định cẳng tay." },
        { title: "Thực hiện:", text: "Gập/duỗi cổ tay trong tầm kiểm soát; không lắc tay." },
        { title: "Hạ:", text: "Hạ chậm; duy trì căng cơ." },
      ],
    },
  },

  // DB One-arm Seated Neutral Wrist Curl
  {
    id: "dumbbell-one-arm-seated-neutral-wrist-curl",
    keywords: [/one.*arm.*seated.*neutral.*wrist.*curl/i, /neutral.*wrist.*curl/i],
    guide: {
      difficulty: "Mới bắt đầu – Trung cấp",
      exercise_type: "Isolation (Brachioradialis + flexors)",
      log_type: "Tạ & Số lần lặp",
      equipment: "Tạ tay",
      steps: [
        { title: "Tư thế:", text: "Ngồi; cẳng tay đặt trên đùi; nắm trung lập (ngón cái hướng lên)." },
        { title: "Cuộn:", text: "Gập/duỗi cổ tay theo trung lập; không xoay cẳng tay." },
        { title: "Hạ:", text: "Hạ chậm; kiểm soát hoàn toàn." },
      ],
    },
  },

  // DB Over-bench One-arm Reverse Wrist Curl (extensors)
  {
    id: "dumbbell-over-bench-one-arm-reverse-wrist-curl",
    keywords: [/over.*bench.*one.*arm.*reverse.*wrist.*curl/i],
    guide: {
      difficulty: "Mới bắt đầu – Trung cấp",
      exercise_type: "Isolation (Extensors – 1 tay)",
      log_type: "Tạ & Số lần lặp",
      equipment: "Tạ tay + ghế",
      steps: [
        { title: "Setup:", text: "Cẳng tay úp trên ghế; nắm sấp; cổ tay ra mép." },
        { title: "Duỗi:", text: "Duỗi cổ tay nâng tạ; không nhấc cẳng tay." },
        { title: "Hạ:", text: "Hạ chậm; tránh bật nảy." },
      ],
    },
  },

  // DB Over-bench 'revers' Wrist Curl (map lỗi chính tả)
  {
    id: "dumbbell-over-bench-revers-wrist-curl",
    keywords: [/over.*bench.*revers.*wrist.*curl/i],
    guide: {
      difficulty: "Mới bắt đầu – Trung cấp",
      exercise_type: "Isolation (Extensors)",
      log_type: "Tạ & Số lần lặp",
      equipment: "Tạ tay + ghế",
      steps: [
        { title: "Lưu ý:", text: "kỹ thuật như reverse wrist curl 1 tay." },
        { title: "Duỗi:", text: "Duỗi cổ tay nâng tạ; giữ cẳng tay cố định." },
        { title: "Hạ:", text: "Hạ có kiểm soát; không lắc cổ tay." },
      ],
    },
  },

  // Smith Seated Wrist Curl (flexors)
  {
    id: "smith-seated-wrist-curl",
    keywords: [/smith.*seated.*wrist.*curl/i],
    guide: {
      difficulty: "Mới bắt đầu",
      exercise_type: "Isolation (Flexors)",
      log_type: "Tạ & Số lần lặp",
      equipment: "Smith machine",
      steps: [
        { title: "Setup:", text: "Ngồi; cẳng tay đặt trên đùi/ghế; nắm ngửa; chỉnh chiều cao thanh phù hợp." },
        { title: "Gập cổ tay:", text: "Cuộn cổ tay nâng thanh; không nâng khuỷu/đổ người." },
        { title: "Hạ:", text: "Hạ sâu kiểm soát; nhịp 2–1–2." },
      ],
    },
  },
];

// ===== GỘP NGÂN HÀNG GUIDE =====
const GUIDE_BANK = [...CHEST_GUIDES, ...BACK_GUIDES, ...SHOULDER_GUIDES,
  ...BICEPS_GUIDES,  ...FOREARM_GUIDES  ,...GLUTE_GUIDES, ...CORE_GUIDES];


/** ================== GỘP LẠI THƯ VIỆN ================== */

/** ================== TIỆN ÍCH CHUNG ================== */
function normStr(s = "") {
  return String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pickGuide(detail) {
  const raw = `${detail?.slug || ""} ${detail?.name_en || ""} ${detail?.name || ""}`;
  const text = normStr(raw);
  let best = null;
  let bestScore = -1;

  for (const item of GUIDE_BANK) {
    let score = 0;
    for (const re of item.keywords) if (re.test(text)) score += 1;
    const idWords = item.id.replace(/-/g, " ");
    if (text.includes(idWords)) score += 2;
    if (score > bestScore) { bestScore = score; best = item.guide; }
  }
  return bestScore > 0 ? best : null;
}

/** ================== COMPONENT ================== */
export default function VXPExerciseDetail({ detail, loading, error, groupName, onBack }) {
  if (loading) return <div className="text-sm text-gray-500">Đang tải chi tiết...</div>;
  if (error) return <div className="text-sm text-red-600">{error}</div>;
  if (!detail) return <div className="text-sm text-gray-500">Không có dữ liệu.</div>;

  // Ưu tiên ảnh từ API → rồi tìm file assets (đã có ưu tiên Lưng trong vxpImages.js)
  const img = detail.image_url || vxpGetExerciseImage(detail, groupName);

  // Lấy hướng dẫn đặc thù nếu có, nếu không rơi về defaultSteps
  const guide = pickGuide(detail);

  const difficulty   = detail.difficulty    || guide?.difficulty    || "Mới bắt đầu";
  const exerciseType = detail.exercise_type || guide?.exercise_type || "Sức mạnh";
  const logType      = detail.log_type      || guide?.log_type      || "Tạ & Số lần lặp";
  const equipment =
    detail.Equipment?.name ||
    detail.equipment ||
    (Array.isArray(detail.equipments) ? detail.equipments.join(", ") : "") ||
    guide?.equipment ||
    "Tạ đơn / Tạ đòn";

  const defaultSteps = [
    { title: "Chuẩn bị:", text: "Lắp mức tạ phù hợp. Ngồi/đứng đúng tư thế, lưng trung lập, bả vai khoá xuống." },
    { title: "Biên độ:", text: "Di chuyển theo biên độ kiểm soát, không nảy tạ; tập trung cảm nhận cơ mục tiêu." },
    { title: "Nhip thở:", text: "Thở ra khi vượt qua điểm khó của chuyển động, hít vào khi về vị trí ban đầu." },
  ];
  const steps = guide?.steps?.length ? guide.steps : defaultSteps;

  function shortTitle(name = "") {
    if (!name) return "";
    return name
      .replace(/\([^)]*\)/g, "")
      .replace(/\b(v\.?\s*\d+)\b/gi, "")
      .replace(/\bpress\b/gi, "")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="px-3 py-1.5 rounded border hover:bg-gray-50">← Quay lại</button>
        <h2 className="text-xl font-semibold text-gray-900">{shortTitle(detail?.name)}</h2>
      </div>

      {/* Info blocks */}
      <div className="grid gap-3 md:grid-cols-3">
        <InfoBlock title="ĐỘ KHÓ" value={difficulty} />
        <InfoBlock title="KIỂU BÀI TẬP" value={exerciseType} infoHint />
        <InfoBlock title="CÁCH GHI LẠI" value={logType} infoHint />
      </div>

      {/* Image */}
      {img && (
        <div className="flex justify-center">
          <img
            src={img}
            alt={detail.name}
            className="w-full max-w-2xl rounded-lg object-contain border bg-white p-2 shadow-sm"
            loading="lazy"
          />
        </div>
      )}

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <MetaPill label="Nhóm chính" value={groupName || "—"} />
        <MetaPill label="Dụng cụ" value={equipment} />
        {detail.slug && <MetaPill label="Slug" value={detail.slug} />}
        {detail.ExerciseMuscleGroup?.impact_level && (
          <MetaPill label="Mức tác động" value={detail.ExerciseMuscleGroup.impact_level} />
        )}
        {"intensity_percentage" in (detail.ExerciseMuscleGroup || {}) && (
          <MetaPill label="Cường độ (%)" value={String(detail.ExerciseMuscleGroup.intensity_percentage ?? "-")} />
        )}
      </div>

      {/* Guide */}
      <section className="rounded-xl bg-white text-gray-900 p-5 shadow-md border">
        <h3 className="text-2xl font-bold mb-4">Hướng dẫn</h3>
        <p className="mb-4 text-gray-700 leading-relaxed">
          Thực hiện theo các bước dưới đây để đảm bảo kỹ thuật và an toàn:
        </p>
        <ol className="space-y-3 list-decimal pl-6 leading-relaxed">
          {steps.map((s, i) => (
            <li key={i}>
              <span className="font-semibold text-gray-900">{s.title}</span>{" "}
              <span className="text-gray-800">{s.text}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function InfoBlock({ title, value, infoHint = false }) {
  return (
    <div className="rounded-xl bg-white text-gray-900 p-4 shadow-sm border">
      <div className="text-[11px] tracking-wider text-gray-500 font-semibold">{title}</div>
      <div className="mt-1.5 flex items-center gap-1.5 text-lg font-semibold">
        <span>{value || "—"}</span>
        {infoHint && <Info className="w-4 h-4 text-gray-400" aria-label="info" />}
      </div>
    </div>
  );
}

function MetaPill({ label, value }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 bg-white shadow-sm">
      <span className="text-gray-500">{label}:</span>
      <span className="font-medium text-gray-800">{value}</span>
    </span>
  );
}
