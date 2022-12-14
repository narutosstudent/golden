import type { ClassNameProps } from '~/types'

export function EditPen({ className }: ClassNameProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 15 14"
      className={className}
    >
      <path
        fill="#EEEFFC"
        d="M14.425 2.091 12.409.075A.256.256 0 0 0 12.227 0a.256.256 0 0 0-.182.075L7.82 4.3a.256.256 0 0 0-.076.182c0 .07.027.134.076.183L9.836 6.68a.256.256 0 0 0 .183.075.256.256 0 0 0 .182-.075l4.224-4.225a.256.256 0 0 0 0-.364ZM6.847 5.956a.256.256 0 0 0-.182-.075.256.256 0 0 0-.182.075L.94 11.498a.256.256 0 0 0-.075.182c0 .069.026.134.075.182l.222.223-.646 1.712c-.03.08-.014.128.004.155a.117.117 0 0 0 .1.048.232.232 0 0 0 .082-.017l1.712-.646.223.222a.256.256 0 0 0 .182.075.256.256 0 0 0 .182-.075l5.542-5.542c.1-.1.1-.264 0-.364L6.847 5.956Z"
      />
    </svg>
  )
}
