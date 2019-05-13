import { Vue, Prop } from 'vue-property-decorator';
import Component from 'vue-class-component';
import Utils from '@/libs/utils';


export interface IMessage {
  content: string;
  alias: string;
  avatar: string;
  time: string;
  type: MsgType;
  priority: MsgPriority;
  scale: MsgScale;
}

export enum MsgPriorityText {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export type MsgType =
  'normal' |
  'inline' |
  'inline-avatar' |
  'server' |
  'implicit-notice' |
  'implicit-passive' |
  'implicit-emote'
;
export type MsgScale    = 'small'|'normal'|'large'|'larger'|'largest';
export type MsgPriority = 'low'|'medium'|'high'


@Component
export default class Message extends Vue {

  @Prop({ type: String })
  readonly alias!: string;

  @Prop({ type: String })
  readonly avatar!: string;

  @Prop({ default: 'normal', type: String })
  readonly scale!: MsgScale;

  @Prop({ default: 'normal', type: String })
  readonly type!: MsgType;

  @Prop({ default: 'low', type: String})
  readonly priority!: MsgPriority;

  @Prop({ type: String })
  readonly content!: string;

  readonly time = Utils.toNormalTimeString(Date.now());



  get scaleClass() {
    return `scale-${this.scale}`
  }

  get priorityClass() {
    return `priority-${this.priority}`;
  }

  get isInline() {
    return (
      this.type == 'inline' ||
      this.type == 'inline-avatar'
    )
  }

  get isImplicit() {
    return !!~this.type.indexOf('implicit');
  }

  get implicitClass() {
    if (!this.isImplicit) throw new Error('Message is not implicit');

    return this.type;
  }

  get isNotice() {
    return this.type == 'implicit-notice'
  }

  get sanitizedContent() {
    let suffix = '';
    let prefix = '';
    if (~this.type.indexOf('emote')) suffix = '...';
    if (~this.type.indexOf('notice')) {
      prefix = suffix = '"';
    }
    return this.$markdown.render(prefix + this.content + suffix);
  }





  created() {
  }




}