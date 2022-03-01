import { EnumPanelStyle, Panel, Snackbar } from "@amplication/design-system";
import { gql, useMutation } from "@apollo/client";
import { isEmpty } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { AuthorizeAppWithGitResult, EnumGitProvider } from "../../models";
import { useTracking } from "../../util/analytics";
import { formatError } from "../../util/error";
import "./AuthAppWithGit.scss";
import GitDialogsContainer from "./dialogs/GitDialogsContainer";
import ExistingConnectionsMenu from "./GitActions/ExistingConnectionsMenu";
import NewConnection from "./GitActions/NewConnection";
import RepositoryActions from "./GitActions/RepositoryActions/RepositoryActions";
import GitSyncNotes from "./GitSyncNotes";
import {
  AppWithGitRepository,
  GitOrganizationFromGitRepository,
} from "./SyncWithGithubPage";

type DType = {
  getGitAppInstallationUrl: AuthorizeAppWithGitResult;
};

// eslint-disable-next-line
let triggerOnDone = () => {};
let triggerAuthFailed = () => {};

type Props = {
  app: AppWithGitRepository;
  onDone: () => void;
};

export const CLASS_NAME = "auth-app-with-github";

function AuthAppWithGit({ app, onDone }: Props) {
  const { workspace, gitRepository } = app;
  const { gitOrganizations } = workspace;
  const [
    gitOrganization,
    setGitOrganization,
  ] = useState<GitOrganizationFromGitRepository | null>(null);
  useEffect(() => {
    if (gitRepository?.gitOrganization) {
      setGitOrganization(gitRepository?.gitOrganization);
    } else if (gitOrganizations.length === 1) {
      setGitOrganization(gitOrganizations[0]);
    } else {
      setGitOrganization(null);
    }
  }, [gitOrganizations, gitRepository?.gitOrganization]);

  const [selectRepoOpen, setSelectRepoOpen] = useState<boolean>(false);
  const [createNewRepoOpen, setCreateNewRepoOpen] = useState(false);
  const [popupFailed, setPopupFailed] = useState(false);
  const { trackEvent } = useTracking();
  const [authWithGit, { error }] = useMutation<DType>(
    START_AUTH_APP_WITH_GITHUB,
    {
      onCompleted: (data) => {
        openSignInWindow(data.getGitAppInstallationUrl.url, "auth with git");
      },
    }
  );

  const handleSelectRepoDialogOpen = useCallback(() => {
    setSelectRepoOpen(true);
  }, []);
  const handleAuthWithGitClick = useCallback(() => {
    trackEvent({
      eventName: "startAuthAppWithGitHub",
    });
    authWithGit({
      variables: {
        sourceControlService: "Github",
      },
    }).catch(console.error);
  }, [authWithGit, trackEvent]);

  triggerOnDone = () => {
    onDone();
  };
  triggerAuthFailed = () => {
    setPopupFailed(true);
  };
  const errorMessage = formatError(error);
  return (
    <>
      {gitOrganization && (
        <GitDialogsContainer
          app={app}
          gitOrganizationId={gitOrganization.id}
          onSelectGitRepositoryDialogClose={() => {
            setSelectRepoOpen(false);
          }}
          selectRepoOpen={selectRepoOpen}
          onPopupFailedClose={() => {
            setPopupFailed(false);
          }}
          isPopupFailed={popupFailed}
          gitCreateRepoOpen={createNewRepoOpen}
          setGitCreateRepo={() => {
            setCreateNewRepoOpen(false);
          }}
          gitProvider={EnumGitProvider.Github}
          gitOrganizationName={gitOrganization.name}
        />
      )}
      <Panel className={CLASS_NAME} panelStyle={EnumPanelStyle.Transparent}>
        <div className={`${CLASS_NAME}__actions`}>
          {isEmpty(gitOrganizations) ? (
            <NewConnection
              onSyncNewGitOrganizationClick={handleAuthWithGitClick}
            />
          ) : (
            <ExistingConnectionsMenu
              gitOrganizations={gitOrganizations}
              onSelectGitOrganization={(organization) => {
                setGitOrganization(organization);
              }}
              selectedGitOrganization={gitOrganization}
              onAddGitOrganization={handleAuthWithGitClick}
            />
          )}
        </div>
        {gitOrganization && (
          <RepositoryActions
            onClickCreateRepository={() => {
              setCreateNewRepoOpen(true);
            }}
            onClickSelectRepository={handleSelectRepoDialogOpen}
            currentConnectedGitRepository={gitRepository}
          />
        )}
        <GitSyncNotes />
      </Panel>

      <Snackbar open={Boolean(error)} message={errorMessage} />
    </>
  );
}

export default AuthAppWithGit;

const START_AUTH_APP_WITH_GITHUB = gql`
  mutation getGitAppInstallationUrl($sourceControlService: EnumGitProvider!) {
    getGitAppInstallationUrl(
      data: { sourceControlService: $sourceControlService }
    ) {
      url
    }
  }
`;

const receiveMessage = (event: any) => {
  const { data } = event;
  if (data.completed) {
    triggerOnDone();
  }
};

let windowObjectReference: any = null;

const openSignInWindow = (url: string, name: string) => {
  // remove any existing event listeners
  window.removeEventListener("message", receiveMessage);

  const width = 600;
  const height = 700;

  const left = (window.screen.width - width) / 2;
  const top = 100;

  // window features
  const strWindowFeatures = `toolbar=no, menubar=no, width=${width}, height=${height}, top=${top}, left=${left}`;

  windowObjectReference = window.open(url, name, strWindowFeatures);
  if (windowObjectReference) {
    windowObjectReference.focus();
  } else {
    triggerAuthFailed();
  }

  // add the listener for receiving a message from the popup
  window.addEventListener("message", (event) => receiveMessage(event), false);
};