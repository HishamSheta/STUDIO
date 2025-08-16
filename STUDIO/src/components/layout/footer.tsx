"use client";

export function Footer() {
  return (
    <footer className="py-6 md:px-8 md:py-0">
      <div className="container flex flex-col items-center justify-center gap-2 md:h-24">
        <p className="text-center text-sm leading-loose text-muted-foreground">
          تم تصميمه وبرمجته بواسطة <a href="https://www.facebook.com/Islams7amseldin/" target="_blank" rel="noopener noreferrer" className="font-medium underline underline-offset-4 hover:text-primary">إسلام شمس الدين</a>
        </p>
        <p className="text-center text-sm leading-loose text-muted-foreground">
         لا تنسونا من صالح دعائكم ❤️
        </p>
      </div>
    </footer>
  );
}
