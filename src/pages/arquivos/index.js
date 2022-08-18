import React, { useState } from 'react';

import Loading from '../../components/loading_screen'
import { Panel } from '../../components/commom_in'

import { Options } from './options'
import { Explorer } from './explorer'

import { UploadModal } from './modals/uploadModal'
import { SecurityModal } from './modals/securityModal'
import { NewFolderModal } from './modals/newFolderModal'
import { RenameModal } from './modals/renameModal'
import { MoveModal } from './modals/moveModal'
import { BlockModal } from './modals/blockModal'
import { DeleteModal } from './modals/deleteModal'

import { useFiles } from '../../hooks/useFiles'

const Arquivos = () => {
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [securityModalOpen, setSecurityModalOpen] = useState(false)
  const [newFolderModalOpen, setNewFolderModalOpen] = useState(false)
  const [renameModalOpen, setRenameModalOpen] = useState(false)
  const [moveModalOpen, setMoveModalOpen] = useState(false)
  const [blockModalOpen, setBlockModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const {
    uiControl: { loaded }
  } = useFiles()

  const handleOpenSecurityModal = () => {
    setSecurityModalOpen(true)
  }

  const handleCloseSecurityModal = () => {
    setSecurityModalOpen(false)
  }

  const handleOpenUploadModal = () => {
    setUploadModalOpen(true)
  }

  const handleCloseUploadModal = () => {
    setUploadModalOpen(false)
  }

  const handleOpenNewFolderModal = () => {
    setNewFolderModalOpen(true)
  }

  const handleCloseNewFolderModal = () => {
    setNewFolderModalOpen(false)
  }

  const handleOpenRenameModal = () => {
    setRenameModalOpen(true)
  }

  const handleCloseRenameModal = () => {
    setRenameModalOpen(false)
  }

  const handleOpenMoveModal = () => {
    setMoveModalOpen(true)
  }

  const handleCloseMoveModal = () => {
    setMoveModalOpen(false)
  }

  const handleOpenBlockModal = () => {
    setBlockModalOpen(true)
  }

  const handleCloseBlockModal = () => {
    setBlockModalOpen(false)
  }

  const handleOpenDeleteModal = () => {
    setDeleteModalOpen(true)
  }

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false)
  }

  return !loaded ?
    <Loading />
    :
    (
      <>
        <UploadModal
          open={uploadModalOpen}
          onClose={handleCloseUploadModal}
        />
        <SecurityModal
          open={securityModalOpen}
          onClose={handleCloseSecurityModal}
        />
        <NewFolderModal
          open={newFolderModalOpen}
          onClose={handleCloseNewFolderModal}
        />
        <RenameModal
          open={renameModalOpen}
          onClose={handleCloseRenameModal}
        />
        <MoveModal
          open={moveModalOpen}
          onClose={handleCloseMoveModal}
        />
        <BlockModal
          open={blockModalOpen}
          onClose={handleCloseBlockModal}
        />
        <DeleteModal
          open={deleteModalOpen}
          onClose={handleCloseDeleteModal}
        />
        <Panel>
          <Options
            onOpenNewFolderModal={handleOpenNewFolderModal}
            onOpenRenameModal={handleOpenRenameModal}
            onOpenUploadModal={handleOpenUploadModal}
            onOpenSecurityModal={handleOpenSecurityModal}
            onOpenMoveModal={handleOpenMoveModal}
            onOpenBlockModal={handleOpenBlockModal}
            onOpenDeleteModal={handleOpenDeleteModal}
          />
          <Explorer />
        </Panel>
      </>
    )
};

export default Arquivos;
