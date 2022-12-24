import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createMusic, deleteMusic, getMusics, patchMusic } from '../api/musics-api'
import Auth from '../auth/Auth'
import { Music } from '../types/Music'

interface MusicsProps {
  auth: Auth
  history: History
}

interface MusicsState {
  musics: Music[]
  newMusicName: string
  loadingMusics: boolean
}

export class Musics extends React.PureComponent<MusicsProps, MusicsState> {
  state: MusicsState = {
    musics: [],
    newMusicName: '',
    loadingMusics: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newMusicName: event.target.value })
  }

  onEditButtonClick = (musicId: string) => {
    this.props.history.push(`/musics/${musicId}/edit`)
  }

  onMusicCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      if (this.state.newMusicName) {
        const newMusic = await createMusic(this.props.auth.getIdToken(), {
          musicName: this.state.newMusicName,
          dueDate
        })
        this.setState({
          musics: [...this.state.musics, newMusic],
          newMusicName: ''
        })
      }
      else {
        alert('Music creation failed, please input music name!')
      }
    } catch {
      alert('Music creation failed')
    }
  }

  onMusicDelete = async (musicId: string) => {
    try {
      await deleteMusic(this.props.auth.getIdToken(), musicId)
      this.setState({
        musics: this.state.musics.filter(music => music.musicId !== musicId)
      })
    } catch {
      alert('Music deletion failed')
    }
  }

  onMusicCheck = async (pos: number) => {
    try {
      const music = this.state.musics[pos]
      await patchMusic(this.props.auth.getIdToken(), music.musicId, {
        musicName: music.musicName,
        dueDate: music.dueDate,
        done: !music.done
      })
      this.setState({
        musics: update(this.state.musics, {
          [pos]: { done: { $set: !music.done } }
        })
      })
    } catch {
      alert('Music deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const musics = await getMusics(this.props.auth.getIdToken())
      this.setState({
        musics,
        loadingMusics: false
      })
    } catch (e) {
      alert(`Failed to fetch musics: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">MUSICS</Header>

        {this.renderCreateMusicInput()}

        {this.renderMusics()}
      </div>
    )
  }

  renderCreateMusicInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New music',
              onClick: this.onMusicCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Input music name..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderMusics() {
    if (this.state.loadingMusics) {
      return this.renderLoading()
    }

    return this.renderMusicsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading MUSICS
        </Loader>
      </Grid.Row>
    )
  }

  renderMusicsList() {
    return (
      <Grid padded>
        {this.state.musics.map((music, pos) => {
          return (
            <Grid.Row key={music.musicId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onMusicCheck(pos)}
                  checked={music.done}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {music.musicName}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {music.dueDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(music.musicId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onMusicDelete(music.musicId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {music.attachmentUrl && (
                <Image src={music.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
