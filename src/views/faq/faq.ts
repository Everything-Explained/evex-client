
import { Component, Vue, Prop } from 'vue-property-decorator';
import faqData from './faq.json';
import MarkdownPaging from '@/components/md-paging/MdPaging.vue';
import { IPage } from '@/components/md-paging/md-paging.js';



@Component({
  components: {
    MarkdownPaging
  }
})
export default class Faq extends Vue {

  @Prop() public page!: string;
  public faq: IPage[] = [];

  created() {
    faqData.forEach(v => {
      this.faq.push({
        title: v.title.split(':').map(v => v.trim()),
        content: v.content,
        date: new Date(v.date)
      })
    })
  }

}