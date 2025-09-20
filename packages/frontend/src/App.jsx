const navItems = [
    { label: 'Trang chủ', href: '#' },
    { label: 'Chương trình', href: '#programs' },
    { label: 'Huấn luyện viên', href: '#coaches' },
    { label: 'Lịch tập', href: '#schedule' }
]

const stats = [
    { label: 'Thành viên năng động', value: '12K+' },
    { label: 'Buổi tập đã hoàn thành', value: '85K+' },
    { label: 'Huấn luyện viên chuyên nghiệp', value: '48' },
    { label: 'Trung tâm liên kết', value: '32' }
]

function App() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black text-slate-100">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-32 right-10 h-96 w-96 rounded-full bg-sky-500/30 blur-3xl" />
                <div className="absolute bottom-10 left-1/4 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
                <div className="absolute -bottom-20 right-[-8rem] h-[28rem] w-[28rem] rounded-full bg-violet-500/20 blur-[200px]" />
                <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black via-black/60 to-transparent" />
            </div>

            <div className="relative z-10 flex min-h-screen flex-col">
                <header className="mx-auto w-full max-w-6xl px-6 pt-10">
                    <div className="floating-card px-8 py-8 md:px-12 md:py-10">
                        <div className="flex flex-wrap items-center justify-between gap-6 border-b border-white/10 pb-6">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-sky-400 to-emerald-400 text-lg font-semibold tracking-[0.2em] text-slate-950 shadow-[0_20px_45px_-18px_rgba(56,189,248,0.65)]">
                                    FN
                                </div>
                                <div>
                                    <p className="text-sm uppercase tracking-[0.3em] text-slate-300/80">FitNexus</p>
                                    <h1 className="text-xl font-semibold text-white md:text-2xl">Nền tảng tập luyện thông minh</h1>
                                </div>
                            </div>
                            <nav className="hidden items-center gap-6 text-sm font-medium text-slate-200 md:flex">
                                {navItems.map(item => (
                                    <a key={item.label} href={item.href} className="transition-colors duration-300 hover:text-sky-300">
                                        {item.label}
                                    </a>
                                ))}
                            </nav>
                            <div className="flex items-center gap-3">
                                <button className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white transition hover:border-sky-400/60 hover:text-sky-300">
                                    Đăng nhập
                                </button>
                                <button className="rounded-full bg-gradient-to-r from-sky-500 to-emerald-400 px-5 py-2 text-sm font-semibold text-slate-900 shadow-[0_20px_45px_-20px_rgba(56,189,248,0.85)] transition hover:from-sky-400 hover:to-emerald-300">
                                    Bắt đầu ngay
                                </button>
                            </div>
                        </div>

                        <div className="mt-8 grid gap-9 lg:grid-cols-[1.15fr,0.85fr] lg:items-center">
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                    Giải pháp tập luyện toàn diện
                                </div>
                                <h2 className="text-4xl font-bold leading-tight text-white md:text-5xl">
                                    Chinh phục mục tiêu hình thể với <span className="text-transparent bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-300 bg-clip-text">đảo năng lượng</span> FitNexus
                                </h2>
                                <p className="max-w-xl text-base text-slate-300 md:text-lg">
                                    Tăng tốc hành trình thay đổi bản thân với lịch tập cá nhân hoá, huấn luyện viên ảo và báo cáo tiến độ trực quan. Trải nghiệm không gian tập luyện sáng tạo như đang phiêu lưu giữa những hòn đảo năng lượng.
                                </p>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {stats.map(stat => (
                                        <div key={stat.label} className="rounded-2xl border border-white/5 bg-white/5 px-5 py-4 shadow-[0_20px_40px_-20px_rgba(8,47,73,0.55)]">
                                            <p className="text-3xl font-semibold text-white">{stat.value}</p>
                                            <p className="mt-1 text-sm text-slate-300">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative mx-auto w-full max-w-md">
                                <div className="absolute -left-10 -top-10 h-24 w-24 rounded-full bg-sky-400/30 blur-3xl" />
                                <div className="absolute -right-10 bottom-6 h-32 w-32 rounded-full bg-emerald-400/20 blur-3xl" />
                                <div className="floating-card px-0 py-0">
                                    <div className="relative h-full w-full px-6 py-8">
                                        <div className="pointer-events-none absolute inset-x-4 bottom-0 h-36 rounded-full bg-gradient-to-t from-sky-500/20 to-transparent blur-2xl" />
                                        <div className="perspective-1200">
                                            <div className="animate-float-soft">
                                                <div className="preserve-3d" style={{ transform: 'rotateY(-22deg) rotateX(18deg)' }}>
                                                    <div className="relative mx-auto h-64 w-64 rounded-[40px] border border-sky-200/20 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 shadow-[0_35px_90px_-30px_rgba(15,23,42,0.9)]">
                                                        <div className="absolute inset-4 rounded-[28px] bg-gradient-to-br from-sky-600/70 via-slate-900 to-slate-950" style={{ transform: 'translateZ(20px)' }} />
                                                        <div className="absolute inset-x-8 top-10 h-4 rounded-full bg-white/40" style={{ transform: 'translateZ(40px)' }} />
                                                        <div className="absolute inset-x-12 top-16 h-3 rounded-full bg-emerald-300/70" style={{ transform: 'translateZ(45px)' }} />
                                                        <div className="absolute inset-x-14 top-24 h-28 rounded-3xl bg-gradient-to-br from-slate-800/80 via-slate-950 to-black" style={{ transform: 'translateZ(60px)' }}>
                                                            <div className="absolute inset-3 rounded-2xl bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950" />
                                                            <div className="absolute left-1/2 top-4 h-1 w-8 -translate-x-1/2 rounded-full bg-white/50" />
                                                            <div className="absolute left-1/2 top-8 h-[96px] w-[64px] -translate-x-1/2 overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
                                                                <div className="absolute inset-x-3 top-3 h-4 rounded-full bg-emerald-300/70" />
                                                                <div className="absolute inset-x-5 top-8 h-[70px] rounded-2xl bg-gradient-to-b from-sky-400/30 via-slate-900 to-slate-950" />
                                                            </div>
                                                        </div>
                                                        <div className="absolute inset-x-12 bottom-8 flex items-center justify-between" style={{ transform: 'translateZ(30px)' }}>
                                                            <div className="h-10 w-10 rounded-2xl bg-sky-500/40" />
                                                            <div className="h-10 w-10 rounded-2xl bg-emerald-400/40" />
                                                            <div className="h-10 w-10 rounded-2xl bg-cyan-300/40" />
                                                        </div>
                                                        <div className="absolute inset-x-12 bottom-2 h-2 rounded-full bg-white/20" />
                                                    </div>
                                                    <div className="absolute left-1/2 top-[-3.5rem] h-36 w-36 -translate-x-1/2 rounded-full border border-cyan-300/30 bg-gradient-to-br from-cyan-500/30 via-transparent to-emerald-300/30 blur-xl" style={{ transform: 'translateZ(110px)' }} />
                                                    <div className="absolute left-1/2 top-[-5.5rem] h-44 w-44 -translate-x-1/2 rounded-full border border-white/10" style={{ transform: 'translateZ(120px)' }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="mx-auto mt-12 w-full max-w-6xl px-6">
                    <section className="floating-card px-8 py-10 md:px-14 md:py-14">
                        <div className="grid gap-10 lg:grid-cols-[0.85fr,1.15fr] lg:items-center">
                            <div className="space-y-6">
                                <h3 className="text-3xl font-semibold text-white md:text-4xl">
                                    Khám phá hòn đảo 3D của huấn luyện viên ảo
                                </h3>
                                <p className="text-base text-slate-300 md:text-lg">
                                    Mô hình 3D trực quan hoá các động tác chuẩn xác, phân tích tư thế theo thời gian thực và đưa ra gợi ý điều chỉnh ngay lập tức. Trải nghiệm cảm giác luyện tập như đang tương tác cùng huấn luyện viên cá nhân trong không gian thực tế ảo.
                                </p>
                                <ul className="space-y-3 text-sm text-slate-200 md:text-base">
                                    <li className="flex items-center gap-3">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/30 text-sky-200">1</span>
                                        Theo dõi chuyển động 360° với hình ảnh cắt lớp rõ nét
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/30 text-sky-200">2</span>
                                        Nhận cảnh báo tư thế thông minh giúp phòng tránh chấn thương
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/30 text-sky-200">3</span>
                                        Đồng bộ tiến độ và dinh dưỡng trên mọi thiết bị
                                    </li>
                                </ul>
                            </div>

                            <div className="relative mx-auto w-full max-w-xl">
                                <div className="absolute -left-10 top-10 h-32 w-32 rounded-full bg-purple-500/20 blur-3xl" />
                                <div className="absolute -right-4 bottom-4 h-36 w-36 rounded-full bg-sky-500/20 blur-3xl" />
                                <div className="floating-card px-0 py-0">
                                    <div className="relative h-[420px] w-full overflow-hidden">
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.35),_rgba(30,64,175,0.05))] opacity-90" />
                                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                                        <div className="relative h-full w-full px-12 py-12">
                                            <div className="perspective-1200">
                                                <div className="animate-float-soft">
                                                    <div className="preserve-3d" style={{ transform: 'rotateY(18deg) rotateX(16deg)' }}>
                                                        <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-sky-300/40 via-white/5 to-violet-400/30 blur-2xl" style={{ transform: 'translateZ(80px)' }} />
                                                        <div className="relative mx-auto h-56 w-56 rounded-full border border-white/10 bg-gradient-to-b from-slate-900 via-slate-950 to-black" style={{ transform: 'translateZ(60px)' }}>
                                                            <div className="absolute inset-6 rounded-full border border-sky-500/40" />
                                                            <div className="absolute inset-12 rounded-full border border-emerald-400/30" />
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <div className="h-28 w-20 rounded-[44px] border border-white/10 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 shadow-[0_25px_70px_-25px_rgba(15,23,42,0.85)]" style={{ transform: 'translateZ(70px)' }}>
                                                                    <div className="absolute left-1/2 top-6 h-12 w-12 -translate-x-1/2 rounded-full bg-gradient-to-br from-sky-500 to-emerald-400" />
                                                                    <div className="absolute left-1/2 bottom-4 h-16 w-16 -translate-x-1/2 rounded-full bg-gradient-to-tr from-emerald-400/60 via-sky-500/40 to-cyan-300/60" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="absolute left-1/2 top-10 h-16 w-16 -translate-x-1/2 rounded-full border border-white/10" style={{ transform: 'translateZ(120px)' }} />
                                                        <div className="absolute left-8 top-16 h-12 w-12 rounded-2xl bg-emerald-400/30" style={{ transform: 'translateZ(100px)' }} />
                                                        <div className="absolute right-10 top-10 h-16 w-16 rounded-3xl bg-sky-400/30" style={{ transform: 'translateZ(90px)' }} />
                                                        <div className="absolute inset-x-10 bottom-6 h-16 rounded-full bg-black/70 blur-xl" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="mx-auto mt-12 w-full max-w-6xl px-6 pb-12">
                    <div className="floating-card px-8 py-10 md:px-12">
                        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                            <div className="max-w-lg space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-sky-400 to-emerald-400 text-lg font-semibold tracking-[0.2em] text-slate-950">
                                        FN
                                    </div>
                                    <div>
                                        <p className="text-sm uppercase tracking-[0.3em] text-slate-300/80">FitNexus</p>
                                        <h4 className="text-lg font-semibold text-white">Cộng đồng tập luyện tương lai</h4>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-300 md:text-base">
                                    Kết nối hệ sinh thái sức khoẻ toàn diện với công nghệ 3D sống động. Cá nhân hoá hành trình luyện tập của bạn mọi lúc, mọi nơi.
                                </p>
                            </div>
                            <div className="grid gap-6 text-sm text-slate-200 sm:grid-cols-2">
                                <div className="space-y-3">
                                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Khám phá</p>
                                    <a href="#programs" className="block transition hover:text-sky-300">Lịch tập mẫu</a>
                                    <a href="#coaches" className="block transition hover:text-sky-300">Huấn luyện viên</a>
                                    <a href="#schedule" className="block transition hover:text-sky-300">Hướng dẫn sử dụng</a>
                                </div>
                                <div className="space-y-3">
                                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Kết nối</p>
                                    <a href="mailto:hello@fitnexus.com" className="block transition hover:text-sky-300">hello@fitnexus.com</a>
                                    <a href="#" className="block transition hover:text-sky-300">Cộng đồng Discord</a>
                                    <a href="#" className="block transition hover:text-sky-300">Tải ứng dụng</a>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 border-t border-white/10 pt-6 text-xs text-slate-400">
                            © {new Date().getFullYear()} FitNexus. Giữ vững nhịp độ, lan toả năng lượng.
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default App
