import { ken } from "../../client/ken.ts";
import { CreateMessage, ModifyChannel } from "../../deps.ts"

export class Channel {
  constructor(private id: bigint) {
    this.exists()
  }

  private exists = async () => {
    if (!(await ken.guild.channels()).has(this.id)) throw Error(`Channel is not exists: ${this.id}`)
  }

  messages = async () => await ken.helpers.getMessages(this.id)
  send = async (opt: CreateMessage) => await ken.helpers.sendMessage(this.id, opt)
  edit = async (opt: ModifyChannel) => await ken.helpers.editChannel(this.id, opt)
  delete = async (id: bigint) => await ken.helpers.deleteMessage(this.id, id)

  private participantsCount = async (): Promise<number> => {
    const participations = ken.kv.list<boolean>({ prefix: ["vc"] })
    const count: boolean[] = []
    for await (const entry of participations) {
      count.push(entry.value)
    }
    return count.length
  }
  isFirstParticipant = async () => (await this.participantsCount()) === 1
  isNoParticipant = async () => (await this.participantsCount()) === 0
}