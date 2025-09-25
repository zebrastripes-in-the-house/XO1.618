function Frame8() {
  return (
    <div className="absolute bg-[#ffe3ca] box-border content-stretch flex gap-[12px] h-[300px] items-center justify-center left-[396px] p-[24px] top-[219px] w-[936px]">
      <div aria-hidden="true" className="absolute border-2 border-[#ab7843] border-solid inset-0 pointer-events-none" />
      <div className="font-['Space_Grotesk:Bold',_sans-serif] font-bold leading-[0] relative shrink-0 text-[34px] text-black text-center text-nowrap tracking-[0.4px]">
        <p className="leading-[41px] whitespace-pre">XO1.618</p>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start leading-[0] relative shrink-0 w-full">
      <div className="font-['Space_Grotesk:Bold',_sans-serif] font-bold relative shrink-0 text-[#6d3914] text-[28px] tracking-[0.38px] w-full">
        <p className="leading-[34px]">Title</p>
      </div>
      <div className="font-['Manrope:Regular',_sans-serif] font-normal relative shrink-0 text-[#d79f66] text-[13px] tracking-[-0.08px] w-full">
        <p className="leading-[18px]">September 17, 2025</p>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="bg-[#ffe3ca] box-border content-stretch flex flex-col gap-[12px] items-start p-[24px] relative shrink-0">
      <div aria-hidden="true" className="absolute border-2 border-[#ab7843] border-solid inset-0 pointer-events-none" />
      <Frame1 />
      <div className="font-['Manrope:Regular',_sans-serif] font-normal leading-[22px] overflow-ellipsis overflow-hidden relative shrink-0 text-[#ab7843] text-[17px] text-nowrap tracking-[-0.43px] w-[400px]">
        <p className="[white-space-collapse:collapse] mb-0 overflow-ellipsis overflow-hidden">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
        <p className="[white-space-collapse:collapse] mb-0 overflow-ellipsis overflow-hidden">Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida.</p>
        <p className="[white-space-collapse:collapse] overflow-ellipsis overflow-hidden">Phasellus fermentum in, dolor. Pellentesque facilisis. Nulla imperdiet sit amet magna. Vestibulum dapibus, mauris nec malesuada fames ac turpis velit, rhoncus eu, luctus et interdum adipiscing wisi. Aliquam erat volutpat. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat.</p>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="absolute content-stretch flex gap-[40px] items-center left-[396px] top-[559px] w-[936px]">
      {[...Array(2).keys()].map((_, i) => (
        <Frame3 key={i} />
      ))}
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start leading-[0] relative shrink-0 w-full">
      <div className="font-['Space_Grotesk:Bold',_sans-serif] font-bold relative shrink-0 text-[#6d3914] text-[28px] tracking-[0.38px] w-full">
        <p className="leading-[34px]">Title</p>
      </div>
      <div className="font-['Manrope:Regular',_sans-serif] font-normal relative shrink-0 text-[#d79f66] text-[13px] tracking-[-0.08px] w-full">
        <p className="leading-[18px]">September 17, 2025</p>
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="bg-[#ffe3ca] box-border content-stretch flex flex-col gap-[12px] items-start p-[24px] relative shrink-0">
      <div aria-hidden="true" className="absolute border-2 border-[#ab7843] border-solid inset-0 pointer-events-none" />
      <Frame9 />
      <div className="font-['Manrope:Regular',_sans-serif] font-normal leading-[22px] overflow-ellipsis overflow-hidden relative shrink-0 text-[#ab7843] text-[17px] text-nowrap tracking-[-0.43px] w-[400px]">
        <p className="[white-space-collapse:collapse] mb-0 overflow-ellipsis overflow-hidden">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
        <p className="[white-space-collapse:collapse] mb-0 overflow-ellipsis overflow-hidden">Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida.</p>
        <p className="[white-space-collapse:collapse] overflow-ellipsis overflow-hidden">Phasellus fermentum in, dolor. Pellentesque facilisis. Nulla imperdiet sit amet magna. Vestibulum dapibus, mauris nec malesuada fames ac turpis velit, rhoncus eu, luctus et interdum adipiscing wisi. Aliquam erat volutpat. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat.</p>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="absolute content-stretch flex gap-[40px] items-center left-[396px] top-[745px] w-[936px]">
      {[...Array(2).keys()].map((_, i) => (
        <Frame10 key={i} />
      ))}
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start leading-[0] relative shrink-0 w-full">
      <div className="font-['Space_Grotesk:Bold',_sans-serif] font-bold relative shrink-0 text-[#6d3914] text-[28px] tracking-[0.38px] w-full">
        <p className="leading-[34px]">Title</p>
      </div>
      <div className="font-['Manrope:Regular',_sans-serif] font-normal relative shrink-0 text-[#d79f66] text-[13px] tracking-[-0.08px] w-full">
        <p className="leading-[18px]">September 17, 2025</p>
      </div>
    </div>
  );
}

function Frame14() {
  return (
    <div className="bg-[#ffe3ca] box-border content-stretch flex flex-col gap-[12px] items-start p-[24px] relative shrink-0">
      <div aria-hidden="true" className="absolute border-2 border-[#ab7843] border-solid inset-0 pointer-events-none" />
      <Frame13 />
      <div className="font-['Manrope:Regular',_sans-serif] font-normal leading-[22px] overflow-ellipsis overflow-hidden relative shrink-0 text-[#ab7843] text-[17px] text-nowrap tracking-[-0.43px] w-[400px]">
        <p className="[white-space-collapse:collapse] mb-0 overflow-ellipsis overflow-hidden">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
        <p className="[white-space-collapse:collapse] mb-0 overflow-ellipsis overflow-hidden">Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida.</p>
        <p className="[white-space-collapse:collapse] overflow-ellipsis overflow-hidden">Phasellus fermentum in, dolor. Pellentesque facilisis. Nulla imperdiet sit amet magna. Vestibulum dapibus, mauris nec malesuada fames ac turpis velit, rhoncus eu, luctus et interdum adipiscing wisi. Aliquam erat volutpat. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat.</p>
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="absolute content-stretch flex gap-[40px] items-center left-[396px] top-[931px] w-[936px]">
      {[...Array(2).keys()].map((_, i) => (
        <Frame14 key={i} />
      ))}
    </div>
  );
}

export default function MacBookPro161() {
  return (
    <div className="bg-[#ffe3ca] relative size-full" data-name="MacBook Pro 16' - 1">
      <Frame8 />
      <Frame5 />
      <Frame6 />
      <Frame7 />
    </div>
  );
}