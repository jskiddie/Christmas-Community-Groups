import { parse as yesNo } from 'yes-no'

export default {
  singleList: yesNo(process.env.SINGLE_LIST || false),
  public: yesNo(process.env.LISTS_PUBLIC || false),
  table: yesNo(process.env.TABLE || true),
  smile: yesNo(process.env.SMILE || true),
  grouping: yesNo(process.env.GROUPING || false),
  note: {
    markdown: yesNo(process.env.MARKDOWN || false)
  }
}
