Giai đoạn 1 (MVP - Sản phẩm khả dụng tối thiểu):

Quản lý Tài khoản & Hồ sơ Cá nhân: Đăng ký, đăng nhập (truyền thống & mạng xã hội), quản lý thông tin cá nhân (chiều cao, cân nặng, ngày sinh, avatar).

Mô hình Giải phẫu 3D Tương tác: Người dùng có thể xoay, phóng to/thu nhỏ mô hình cơ thể. Khi chọn một nhóm cơ, hệ thống sẽ hiển thị thông tin chi. tiết và các bài tập liên quan.

Thư viện Bài tập Chi tiết & Cá nhân hóa: Cung cấp một danh sách lớn các bài tập. Mỗi bài tập có hướng dẫn từng bước, video minh họa, mức độ khó và dụng cụ cần thiết.

Theo dõi Tiến độ Trực quan: Người dùng có thể cập nhật các chỉ số cơ thể (cân nặng, số đo các vòng) và tải lên hình ảnh tiến độ theo thời gian để theo dõi sự thay đổi.

Các Giai đoạn Phát triển Tương lai:

Huấn luyện viên AI Nâng cao & Lộ trình Động: AI sẽ tự động đề xuất và điều chỉnh kế hoạch tập luyện hàng tuần dựa trên mục tiêu, thể trạng và phản hồi của người dùng sau mỗi buổi tập.

Tư vấn Dinh dưỡng: AI đề xuất kế hoạch dinh dưỡng, gợi ý các bữa ăn phù hợp với mục tiêu (tăng cơ, giảm mỡ) của người dùng.

Sàn thương mại điện tử Tích hợp (E-commerce): Một khu vực để bán các sản phẩm bổ sung (whey, creatine...). AI có thể gợi ý sản phẩm phù hợp dựa trên dữ liệu người dùng.

Nền tảng Cộng đồng (Blog & Diễn đàn): Khu vực để người dùng chia sẻ kinh nghiệm, đặt câu hỏi, viết blog và tương tác với nhau.

Bản đồ & Đánh giá Phòng Gym: Tích hợp bản đồ, cho phép người dùng tìm kiếm, đánh giá và bình luận về các phòng gym ở gần họ.




Chi tiết hơn về luồng hoạt động : 



Luồng Hoạt động cho Người dùng Thường (Tập trung vào Khám phá)
Giai đoạn 1: Onboarding (Thiết lập Nền tảng)
Luồng này vẫn giữ nguyên vì nó rất quan trọng để thu thập dữ liệu nền cho việc theo dõi tiến độ sau này.
Đăng ký / Đăng nhập thành công.
Chuyển hướng đến Trang Onboarding (bắt buộc lần đầu):
Bước 1: Nhập các thông tin cơ bản: Chiều cao, Cân nặng, Ngày sinh, Giới tính.
Hệ thống: Tự động tạo bản ghi UserProgress đầu tiên. Đây là điểm mốc số 0 của người dùng.
Bước 2: (Tùy chọn nhưng nên có) Hỏi về Mục tiêu (Tăng cơ, Giảm mỡ...) và Trình độ (Mới bắt đầu...). Dữ liệu này có thể không dùng ngay nhưng rất quý giá cho các phân tích và gợi ý trong tương lai.
Hoàn thành Onboarding -> Chuyển hướng đến Trang chủ.
Giai đoạn 2: Trải nghiệm Cốt lõi tại Trang chủ
Đây là lúc luồng của chúng ta thay đổi hoàn toàn.
Màn hình chính LÀ Mô hình 3D:
Khi vào Trang chủ (Dashboard), người dùng không thấy các widget "Hôm nay tập gì". Thay vào đó, họ thấy ngay mô hình giải phẫu 3D tương tác chiếm phần lớn màn hình.
Có một dòng chữ mời gọi hành động rõ ràng: "Chào [Tên người dùng], hãy chọn một nhóm cơ bạn muốn tập hôm nay."
Tương tác và Khám phá:
Người dùng có thể dùng chuột/ngón tay để xoay, phóng to, thu nhỏ mô hình.
Khi di chuột/trỏ vào một nhóm cơ (ví dụ: cơ ngực), nhóm cơ đó sẽ được highlight (tô sáng) và hiển thị tên của nó (MuscleGroups.name).
Lựa chọn và Truy vấn (Hành động chính):
Người dùng click vào một hoặc nhiều nhóm cơ mà họ quan tâm. Ví dụ: click chọn "Ngực" (Chest) và "Tay sau" (Triceps).
Các nhóm cơ được chọn sẽ được giữ ở trạng thái highlight.
Một nút hoặc một panel bên cạnh sẽ hiện ra với nội dung: "Tìm bài tập".
Hiển thị Kết quả:
Khi người dùng click vào nút "Tìm bài tập", hệ thống sẽ hiển thị một danh sách các bài tập phù hợp.
Logic truy vấn phía sau:
Hệ thống sẽ truy vấn vào bảng Exercise_MuscleGroup.
Nó sẽ tìm tất cả các exercise_id liên quan đến "Ngực" VÀ "Tay sau".
Tinh chỉnh quan trọng: Hệ thống nên ưu tiên hiển thị các bài tập tác động chính (impact_level: 'primary') vào "Ngực", và có tác động phụ (impact_level: 'secondary') vào "Tay sau" (ví dụ: các bài đẩy ngực), hoặc ngược lại.
Danh sách kết quả hiển thị các thông tin cơ bản: Tên bài tập, ảnh thumbnail, độ khó.
Xem Chi tiết Bài tập:
Người dùng click vào một bài tập cụ thể trong danh sách (ví dụ: "Đẩy ngực với tạ đòn - Barbell Bench Press").
Họ được chuyển đến Trang Chi tiết Bài tập.
Trang này hiển thị đầy đủ thông tin:
Video hướng dẫn lớn, rõ ràng (Exercises.primary_video_url).
Mô tả chi tiết (Exercises.description).
Hướng dẫn từng bước (ExerciseSteps).
Các nhóm cơ bị tác động (liệt kê từ Exercise_MuscleGroup).
Dụng cụ cần thiết, độ khó...
Giai đoạn 3: Từ Khám phá đến Hành động
Đây là bước kết nối việc học với việc làm.
Xây dựng Buổi tập "Tạm thời":
Trên Trang Chi tiết Bài tập, có một nút Call-to-Action (CTA) nổi bật: "Thêm vào Buổi tập hôm nay".
Khi người dùng click nút này, bài tập đó sẽ được thêm vào một "khay" hoặc một danh sách tạm thời cho buổi tập hiện tại.
Người dùng có thể quay lại mô hình 3D hoặc thư viện để chọn và thêm các bài tập khác.
Bắt đầu và Ghi nhận:
Khi đã chọn đủ các bài tập mong muốn, người dùng sẽ vào khu vực "Buổi tập hôm nay" (có thể là một icon trên thanh điều hướng).
Tại đây, họ thấy danh sách các bài đã chọn và một nút "Bắt đầu Tập".
Khi click bắt đầu, giao diện sẽ chuyển sang chế độ ghi log, cho phép họ nhập số hiệp, số lần lặp, mức tạ cho từng bài.
Khi hoàn thành, dữ liệu được lưu vào UserWorkoutLogs và UserWorkoutLog_Detail



Chính xác! Đây chính là lúc chúng ta khai thác sức mạnh của dữ liệu đã thu thập để tạo ra một giá trị vượt trội, một lý do không thể chối từ để người dùng nâng cấp lên Premium.

Với vai trò là khách hàng của bạn, tôi muốn phiên bản Premium biến ứng dụng từ một cuốn từ điển giải phẫu (Free version) thành một huấn luyện viên cá nhân thông minh (Premium version).

Luồng 3D model vẫn là một phần của trải nghiệm, nhưng giờ đây nó không còn là điểm khởi đầu duy nhất nữa. Điểm khởi đầu của người dùng Premium là một lộ trình đã được cá nhân hóa.

Triết lý Cốt lõi của Premium: Từ "Khám phá" đến "Được Dẫn dắt"

Người dùng Thường (Free): Chủ động. Họ phải tự hỏi "Hôm nay mình muốn tập gì?", sau đó tự tìm kiếm và xây dựng.

Người dùng Cao cấp (Premium): Được dẫn dắt. Hệ thống sẽ chủ động trả lời câu hỏi "Dựa trên mục tiêu của bạn, hôm nay bạn nên tập gì để đạt hiệu quả cao nhất?".

Các Chức năng và Luồng hoạt động của Premium
1. Huấn luyện viên AI & Lộ trình Tập luyện Cá nhân hóa (AI Coach & Personalized Roadmap)

Đây là tính năng "sát thủ" của gói Premium.

Nó là gì? Ngay sau khi hoàn thành Onboarding, hệ thống sẽ tự động tạo ra một kế hoạch tập luyện dài hạn (ví dụ: 4-8 tuần) dựa trên dữ liệu người dùng cung cấp.

Luồng hoạt động:

Sau khi người dùng Premium hoàn tất Onboarding (chọn Mục tiêu, Trình độ, số buổi/tuần mong muốn), họ sẽ không vào thẳng màn hình 3D.

Thay vào đó, một màn hình chào mừng sẽ xuất hiện: "Tuyệt vời, [Tên người dùng]! Dựa trên mục tiêu [Tăng cơ] của bạn, chúng tôi đã tạo một Lộ trình 4 tuần dành riêng cho bạn. Sẵn sàng để bắt đầu chưa?"

Hệ thống thực hiện truy vấn phức tạp để tạo ra các bản ghi trong WorkoutPlans và Plan_Exercise_Details dành riêng cho user_id này.

Trang chủ (Dashboard) của người dùng Premium sẽ hoàn toàn khác:

Vị trí trung tâm: Widget "Buổi tập Hôm nay: Tuần 1, Ngày 1 - Tập Ngực & Tay sau".

Widget này hiển thị tóm tắt các bài tập sẽ có trong buổi đó.

Nút Call-to-Action lớn: "Bắt đầu Buổi tập".

Bên dưới là Lịch tập Tuần: Hiển thị rõ ràng các buổi tập được lên lịch cho cả tuần (ví dụ: Thứ 2: Ngực, Thứ 3: Chân, Thứ 4: Nghỉ...).

Mô hình 3D và Thư viện vẫn có thể truy cập dễ dàng từ thanh điều hướng, nhưng không còn là trọng tâm chính của trang chủ.

Dữ liệu sử dụng: Users (goal, experience_level), WorkoutPlans, Plan_Exercise_Details.

2. Tự động Điều chỉnh Lộ trình (Dynamic Plan Adjustment)

Huấn luyện viên giỏi không đưa ra một kế hoạch rồi bỏ đó. Họ điều chỉnh.

Nó là gì? Sau mỗi 2-4 tuần, hệ thống sẽ phân tích dữ liệu tập luyện (UserWorkoutLogs) và tiến độ (UserProgress) của người dùng để đề xuất các điều chỉnh.

Luồng hoạt động:

Người dùng đã hoàn thành 2 tuần trong lộ trình.

Hệ thống chạy một tác vụ nền để phân tích: "Người dùng có hoàn thành tất cả các buổi tập không? Mức tạ họ nâng có tăng lên không? Họ có ghi chú gì về việc bài tập quá dễ hay quá khó không?".

Một thông báo sẽ hiện ra: "Bạn đã làm rất tốt! Chúng tôi nhận thấy bạn đã vượt qua mức tạ đề xuất ở bài [Bench Press]. Bạn có muốn tăng độ khó cho lộ trình tuần tới không?"

Nếu người dùng đồng ý, hệ thống sẽ tự động cập nhật các bài tập, số hiệp/lần lặp trong Plan_Exercise_Details cho các tuần tiếp theo.

Dữ liệu sử dụng: UserWorkoutLog_Details (reps_achieved, weight_kg), UserProgress (weight_kg), Notes trong UserWorkoutLogs.

3. Phân tích Tiến độ Chuyên sâu & Dự báo

Cung cấp cho người dùng cái nhìn sâu sắc hơn về dữ liệu của chính họ.

Nó là gì? Một tab "Phân tích" đặc biệt trong khu vực Profile, cung cấp các biểu đồ và số liệu mà người dùng thường không có.

Luồng hoạt động:

Người dùng Premium vào Profile và chọn tab "Phân tích".

Họ sẽ thấy:

Biểu đồ Tổng khối lượng (Total Volume): Biểu đồ thể hiện tổng (số hiệp x số lần lặp x mức tạ) theo thời gian cho từng nhóm cơ.

Ước tính 1RM (One-Rep Max): Hệ thống có thể ước tính sức mạnh tối đa của người dùng cho các bài tập chính.

So sánh Tương quan: "Trong tháng bạn tập chân đều đặn, số đo vòng đùi của bạn đã tăng 0.5cm."

Dữ liệu sử dụng: Tổng hợp và tính toán từ UserProgress và UserWorkoutLog_Details.

4. Kế hoạch Dinh dưỡng Gợi ý (Future Premium Feature)

Đây là bước phát triển tự nhiên từ việc cá nhân hóa lộ trình tập luyện.

Nó là gì? Dựa trên mục tiêu và cân nặng hiện tại, hệ thống sẽ đề xuất lượng calo và macro (protein, carb, fat) hàng ngày.

Luồng hoạt động:

Trong khu vực Profile, người dùng Premium sẽ thấy một tab "Dinh dưỡng".

Hệ thống hiển thị: "Để đạt mục tiêu [Giảm mỡ] với cân nặng hiện tại, bạn nên nạp khoảng calo mỗi ngày, bao gồm [150g] protein."

Gợi ý các loại thực phẩm phù hợp.

Dữ liệu sử dụng: Users (goal), UserProgress (weight_kg, height_cm, body_fat_percentage).

Bảng so sánh Trải nghiệm: Free vs. Premium
Tính năng	Người dùng Thường (Free)	Người dùng Cao cấp (Premium)
Trang chủ	Mô hình 3D tương tác là trung tâm.	Dashboard với Lộ trình Cá nhân là trung tâm.
Lập kế hoạch	Tự xây dựng buổi tập cho hôm nay.	Được cung cấp Lộ trình dài hạn (nhiều tuần).
Sự Dẫn dắt	Phản ứng (Reactive): Bạn chọn, app hiển thị.	Chủ động (Proactive): App đề xuất, bạn tuân theo.
Điều chỉnh	Tự cảm nhận và thay đổi bài tập.	Hệ thống tự động phân tích và đề xuất điều chỉnh.
Phân tích	Biểu đồ cơ bản (cân nặng, số đo).	Phân tích chuyên sâu (tổng volume, ước tính 1RM).
Dinh dưỡng	Không có.	Gợi ý calo & macro hàng ngày.

Mô hình này tạo ra một sự phân cấp giá trị rất rõ ràng. Phiên bản miễn phí cực kỳ hữu ích như một công cụ học tập và ghi chép, nhưng nếu người dùng muốn có một kế hoạch, một sự dẫn dắt thông minh và kết quả được tối ưu hóa, họ sẽ có một lý do mạnh mẽ để nâng cấp lên Premium.