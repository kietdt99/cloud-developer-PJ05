import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { getUploadUrl, uploadFile } from '../api/musics-api'

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile,
}

interface EditMusicProps {
  match: {
    params: {
      musicId: string
    }
  }
  auth: Auth
}

interface EditMusicState {
  file: any
  uploadState: UploadState
}

export class EditMusic extends React.PureComponent<
  EditMusicProps,
  EditMusicState
> {
  state: EditMusicState = {
    file: undefined,
    uploadState: UploadState.NoUpload
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.file) {
        alert('File should be selected')
        return
      }

      this.setUploadState(UploadState.FetchingPresignedUrl)
      const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), this.props.match.params.musicId)

      this.setUploadState(UploadState.UploadingFile)
      await uploadFile(uploadUrl, this.state.file)

      alert('File was uploaded!')
    } catch (e) {
      alert('Could not upload a file: ' + (e as Error).message)
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }
  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }

  render() {
    return (
      <div>
        <div>
          <h1>Update new music name</h1>
          
          <Form onSubmit={this.handleSubmit}>
            <Form.Field>
              <input
                type="text"
                placeholder="Music name..."
                onChange={this.handleFileChange}
              />
            </Form.Field>

            {this.renderUpdateButton()}
          </Form>
        </div>
        <div>
          <h1>Upload new image</h1>

          <Form onSubmit={this.handleSubmit}>
            <Form.Field>
              <label>File</label>
              <input
                type="file"
                accept="image/*"
                placeholder="Image to upload"
                onChange={this.handleFileChange}
              />
            </Form.Field>

            {this.renderUploadButton()}
          </Form>
        </div>
      </div>
    )
  }

  renderUpdateButton() {

    return (
      <div>
        {this.state.uploadState === UploadState.FetchingPresignedUrl && <p>Uploading image metadata</p>}
        {this.state.uploadState === UploadState.UploadingFile && <p>Uploading file</p>}
        <Button
          loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit"
        >
          Update
        </Button>
      </div>
    )
  }

  renderUploadButton() {

    return (
      <div>
        {this.state.uploadState === UploadState.FetchingPresignedUrl && <p>Uploading image metadata</p>}
        {this.state.uploadState === UploadState.UploadingFile && <p>Uploading file</p>}
        <Button
          loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit"
        >
          Upload
        </Button>
      </div>
    )
  }
}
