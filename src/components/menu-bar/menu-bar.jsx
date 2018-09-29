import classNames from 'classnames';
import {connect} from 'react-redux';
import {defineMessages, FormattedMessage, injectIntl, intlShape} from 'react-intl';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';
import React from 'react';

import Box from '../box/box.jsx';
import Button from '../button/button.jsx';
import {ComingSoonTooltip} from '../coming-soon/coming-soon.jsx';
import Divider from '../divider/divider.jsx';
import LanguageSelector from '../../containers/language-selector.jsx';
import ProjectLoader from '../../containers/project-loader.jsx';
import MenuBarMenu from './menu-bar-menu.jsx';
import {MenuItem, MenuSection} from '../menu/menu.jsx';
import ProjectTitleInput from './project-title-input.jsx';
import AccountNav from '../../containers/account-nav.jsx';
import LoginDropdown from './login-dropdown.jsx';
import ProjectSaver from '../../containers/project-saver.jsx';
import DeletionRestorer from '../../containers/deletion-restorer.jsx';
import TurboMode from '../../containers/turbo-mode.jsx';

import {openTipsLibrary} from '../../reducers/modals';
import {setPlayer} from '../../reducers/mode';
import {
    openAccountMenu,
    closeAccountMenu,
    accountMenuOpen,
    openFileMenu,
    closeFileMenu,
    fileMenuOpen,
    openEditMenu,
    closeEditMenu,
    editMenuOpen,
    openLanguageMenu,
    closeLanguageMenu,
    languageMenuOpen,
    openLoginMenu,
    closeLoginMenu,
    loginMenuOpen
} from '../../reducers/menus';

import styles from './menu-bar.css';

import helpIcon from '../../lib/assets/icon--tutorials.svg';
import mystuffIcon from './icon--mystuff.png';
import feedbackIcon from './icon--feedback.svg';
import profileIcon from './icon--profile.png';
import communityIcon from './icon--see-community.svg';
import dropdownCaret from './dropdown-caret.svg';
import languageIcon from '../language-selector/language-icon.svg';

import scratchLogo from './scratch-logo.svg';

const ariaMessages = defineMessages({
    language: {
        id: 'gui.menuBar.LanguageSelector',
        defaultMessage: 'language selector',
        description: 'accessibility text for the language selection menu'
    },
    tutorials: {
        id: 'gui.menuBar.tutorialsLibrary',
        defaultMessage: 'Tutorials',
        description: 'accessibility text for the tutorials button'
    }
});

const MenuBarItemTooltip = ({
    children,
    className,
    enable,
    id,
    place = 'bottom'
}) => {
    if (enable) {
        return (
            <React.Fragment>
                {children}
            </React.Fragment>
        );
    }
    return (
        <ComingSoonTooltip
            className={classNames(styles.comingSoon, className)}
            place={place}
            tooltipClassName={styles.comingSoonTooltip}
            tooltipId={id}
        >
            {children}
        </ComingSoonTooltip>
    );
};


MenuBarItemTooltip.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    enable: PropTypes.bool,
    id: PropTypes.string,
    place: PropTypes.oneOf(['top', 'bottom', 'left', 'right'])
};

const MenuItemTooltip = ({id, isRtl, children, className}) => (
    <ComingSoonTooltip
        className={classNames(styles.comingSoon, className)}
        isRtl={isRtl}
        place={isRtl ? 'left' : 'right'}
        tooltipClassName={styles.comingSoonTooltip}
        tooltipId={id}
    >
        {children}
    </ComingSoonTooltip>
);

MenuItemTooltip.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    id: PropTypes.string,
    isRtl: PropTypes.bool
};

class MenuBar extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleLanguageMouseUp',
            'handleRestoreOption',
            'handleProjectLoadFinished',
            'handleCloseFileMenuAndThen',
            'restoreOptionMessage'
        ]);
        this.state = {projectSaveInProgress: false};
    }
    handleLanguageMouseUp (e) {
        if (!this.props.languageMenuOpen) {
            this.props.onClickLanguage(e);
        }
    }
    handleRestoreOption (restoreFun) {
        return () => {
            restoreFun();
            this.props.onRequestCloseEdit();
        };
    }
    handleNewProject (updateFun) {
        return () => {
            this.props.onRequestCloseFile();
            if (this.props.userOwnsProject) {
                this.setState({projectSaveInProgress: true},
                    () => {
                        updateFun().then(() => {
                            this.props.onRequestNewProject(() => {
                                this.setState({projectSaveInProgress: false});
                            });
                        });
                    }
                );
            } else {
                this.props.onRequestNewProject();
            }
        };
    }
    handleUpdateProject (updateFun) {
        return () => {
            this.props.onRequestCloseFile();
            this.setState({projectSaveInProgress: true},
                () => {
                    updateFun().then(() => {
                        this.setState({projectSaveInProgress: false});
                    });
                }
            );
        };
    }
    handleProjectLoadFinished () {
        this.props.onRequestCloseFile();
    }
    handleCloseFileMenuAndThen (fn) {
        return () => {
            this.props.onRequestCloseFile();
            fn();
        };
    }
    restoreOptionMessage (deletedItem) {
        switch (deletedItem) {
        case 'Sprite':
            return (<FormattedMessage
                defaultMessage="Restore Sprite"
                description="Menu bar item for restoring the last deleted sprite."
                id="gui.menuBar.restoreSprite"
            />);
        case 'Sound':
            return (<FormattedMessage
                defaultMessage="Restore Sound"
                description="Menu bar item for restoring the last deleted sound."
                id="gui.menuBar.restoreSound"
            />);
        case 'Costume':
            return (<FormattedMessage
                defaultMessage="Restore Costume"
                description="Menu bar item for restoring the last deleted costume."
                id="gui.menuBar.restoreCostume"
            />);
        default: {
            return (<FormattedMessage
                defaultMessage="Restore"
                description="Menu bar item for restoring the last deleted item in its disabled state." /* eslint-disable-line max-len */
                id="gui.menuBar.restore"
            />);
        }
        }
    }
    render () {
        const saveNowMessage = (
            <FormattedMessage
                defaultMessage="Save now"
                description="Menu bar item for saving now"
                id="gui.menuBar.saveNow"
            />
        );
        const shareButton = (
            <Button
                className={classNames(styles.shareButton)}
                onClick={this.props.onShare}
            >
                <FormattedMessage
                    defaultMessage="Share"
                    description="Label for project share button"
                    id="gui.menuBar.share"
                />
            </Button>
        );
        return (
            <Box
                className={classNames(styles.menuBar, {
                    [styles.saveInProgress]: this.state.projectSaveInProgress
                })}
            >
                <div className={styles.mainMenu}>
                    <div className={styles.fileGroup}>
                        <div className={classNames(styles.menuBarItem)}>
                            <a
                                href="https://scratch.mit.edu"
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                <img
                                    alt="Scratch"
                                    className={styles.scratchLogo}
                                    draggable={false}
                                    src={scratchLogo}
                                />
                            </a>
                        </div>
                        <div
                            className={classNames(styles.menuBarItem, styles.hoverable, styles.languageMenu)}
                        >
                            <div>
                                <img
                                    className={styles.languageIcon}
                                    src={languageIcon}
                                />
                                <img
                                    className={styles.languageCaret}
                                    src={dropdownCaret}
                                />
                            </div>
                            <LanguageSelector label={this.props.intl.formatMessage(ariaMessages.language)} />
                        </div>
                        <div
                            className={classNames(styles.menuBarItem, styles.hoverable, {
                                [styles.active]: this.props.fileMenuOpen
                            })}
                            onMouseUp={this.props.onClickFile}
                        >
                            <FormattedMessage
                                defaultMessage="File"
                                description="Text for file dropdown menu"
                                id="gui.menuBar.file"
                            />
                            <MenuBarMenu
                                className={classNames(styles.menuBarMenu)}
                                open={this.props.fileMenuOpen}
                                place={this.props.isRtl ? 'left' : 'right'}
                                onRequestClose={this.props.onRequestCloseFile}
                            >
                                <ProjectSaver onSaveProject={this.handleProjectLoadFinished}>
                                    {(saveProject, updateProject, createProject) => (
                                        <MenuItem
                                            isRtl={this.props.isRtl}
                                            onClick={this.handleNewProject(createProject)}
                                        >
                                            <FormattedMessage
                                                defaultMessage="New"
                                                description="Menu bar item for creating a new project"
                                                id="gui.menuBar.new"
                                            />
                                        </MenuItem>
                                    )}
                                </ProjectSaver>
                                <MenuSection>
                                    <ProjectSaver>{(saveProject, updateProject) => (
                                        this.props.canUpdateProject && this.props.userOwnsProject ? (
                                            <MenuItem onClick={this.handleUpdateProject(updateProject)}>
                                                {saveNowMessage}
                                            </MenuItem>
                                        ) : (
                                            <MenuItemTooltip
                                                id="save"
                                                isRtl={this.props.isRtl}
                                            >
                                                <MenuItem>{saveNowMessage}</MenuItem>
                                            </MenuItemTooltip>
                                        )
                                    )}</ProjectSaver>
                                    <MenuItemTooltip
                                        id="copy"
                                        isRtl={this.props.isRtl}
                                    >
                                        <MenuItem>
                                            <FormattedMessage
                                                defaultMessage="Save as a copy"
                                                description="Menu bar item for saving as a copy"
                                                id="gui.menuBar.saveAsCopy"
                                            />
                                        </MenuItem>
                                    </MenuItemTooltip>
                                </MenuSection>
                                <MenuSection>
                                    <ProjectLoader
                                        onLoadFinished={this.handleProjectLoadFinished}
                                        onUpdateProjectTitle={this.props.onUpdateProjectTitle}
                                    >
                                        {(renderFileInput, loadProject) => (
                                            <MenuItem
                                                onClick={loadProject}
                                            >
                                                <FormattedMessage
                                                    defaultMessage="Load from your computer"
                                                    description={'Menu bar item for uploading a ' +
                                                        'project from your computer'}
                                                    id="gui.menuBar.uploadFromComputer"
                                                />
                                                {renderFileInput()}
                                            </MenuItem>
                                        )}
                                    </ProjectLoader>
                                    <ProjectSaver>{saveProject => (
                                        <MenuItem
                                            onClick={this.handleCloseFileMenuAndThen(saveProject)}
                                        >
                                            <FormattedMessage
                                                defaultMessage="Save to your computer"
                                                description="Menu bar item for downloading a project to your computer"
                                                id="gui.menuBar.downloadToComputer"
                                            />
                                        </MenuItem>
                                    )}</ProjectSaver>
                                </MenuSection>
                            </MenuBarMenu>
                        </div>
                        <div
                            className={classNames(styles.menuBarItem, styles.hoverable, {
                                [styles.active]: this.props.editMenuOpen
                            })}
                            onMouseUp={this.props.onClickEdit}
                        >
                            <div className={classNames(styles.editMenu)}>
                                <FormattedMessage
                                    defaultMessage="Edit"
                                    description="Text for edit dropdown menu"
                                    id="gui.menuBar.edit"
                                />
                            </div>
                            <MenuBarMenu
                                className={classNames(styles.menuBarMenu)}
                                open={this.props.editMenuOpen}
                                place={this.props.isRtl ? 'left' : 'right'}
                                onRequestClose={this.props.onRequestCloseEdit}
                            >
                                <DeletionRestorer>{(handleRestore, {restorable, deletedItem}) => (
                                    <MenuItem
                                        className={classNames({[styles.disabled]: !restorable})}
                                        onClick={this.handleRestoreOption(handleRestore)}
                                    >
                                        {this.restoreOptionMessage(deletedItem)}
                                    </MenuItem>
                                )}</DeletionRestorer>
                                <MenuSection>
                                    <TurboMode>{(toggleTurboMode, {turboMode}) => (
                                        <MenuItem onClick={toggleTurboMode}>
                                            {turboMode ? (
                                                <FormattedMessage
                                                    defaultMessage="Turn off Turbo Mode"
                                                    description="Menu bar item for turning off turbo mode"
                                                    id="gui.menuBar.turboModeOff"
                                                />
                                            ) : (
                                                <FormattedMessage
                                                    defaultMessage="Turn on Turbo Mode"
                                                    description="Menu bar item for turning on turbo mode"
                                                    id="gui.menuBar.turboModeOn"
                                                />
                                            )}
                                        </MenuItem>
                                    )}</TurboMode>
                                </MenuSection>
                            </MenuBarMenu>
                        </div>
                    </div>
                    <Divider className={classNames(styles.divider)} />
                    <div
                        aria-label={this.props.intl.formatMessage(ariaMessages.tutorials)}
                        className={classNames(styles.menuBarItem, styles.hoverable)}
                        onClick={this.props.onOpenTipLibrary}
                    >
                        <img
                            className={styles.helpIcon}
                            src={helpIcon}
                        />
                        <FormattedMessage {...ariaMessages.tutorials} />
                    </div>
                    <Divider className={classNames(styles.divider)} />
                    <div className={classNames(styles.menuBarItem, styles.growable)}>
                        <MenuBarItemTooltip
                            enable
                            id="title-field"
                        >
                            <ProjectTitleInput
                                className={classNames(styles.titleFieldGrowable)}
                                onUpdateProjectTitle={this.props.onUpdateProjectTitle}
                            />
                        </MenuBarItemTooltip>
                    </div>
                    <div className={classNames(styles.menuBarItem)}>
                        {this.props.onShare ? shareButton : (
                            <MenuBarItemTooltip id="share-button">
                                {shareButton}
                            </MenuBarItemTooltip>
                        )}
                    </div>
                    <div className={classNames(styles.menuBarItem, styles.communityButtonWrapper)}>
                        {this.props.enableCommunity ?
                            <Button
                                className={classNames(styles.communityButton)}
                                iconClassName={styles.communityButtonIcon}
                                iconSrc={communityIcon}
                                onClick={this.props.onSeeCommunity}
                            >
                                <FormattedMessage
                                    defaultMessage="See Community"
                                    description="Label for see community button"
                                    id="gui.menuBar.seeCommunity"
                                />
                            </Button> :
                            <MenuBarItemTooltip id="community-button">
                                <Button
                                    className={classNames(styles.communityButton)}
                                    iconClassName={styles.communityButtonIcon}
                                    iconSrc={communityIcon}
                                >
                                    <FormattedMessage
                                        defaultMessage="See Community"
                                        description="Label for see community button"
                                        id="gui.menuBar.seeCommunity"
                                    />
                                </Button>
                            </MenuBarItemTooltip>
                        }
                    </div>
                </div>

                {/* show the proper UI in the account menu, given whether the user is
                logged in, and whether a session is available to log in with */}
                <div className={styles.accountInfoGroup}>
                    {this.props.sessionExists ? (
                        this.props.username ? (
                            // ************ user is logged in ************
                            <React.Fragment>
                                <a href="/mystuff/">
                                    <div
                                        className={classNames(
                                            styles.menuBarItem,
                                            styles.hoverable,
                                            styles.mystuffButton
                                        )}
                                    >
                                        <img
                                            className={styles.mystuffIcon}
                                            src={mystuffIcon}
                                        />
                                    </div>
                                </a>
                                <AccountNav
                                    className={classNames(
                                        styles.menuBarItem,
                                        styles.hoverable,
                                        {[styles.active]: this.props.accountMenuOpen}
                                    )}
                                    isOpen={this.props.accountMenuOpen}
                                    isRtl={this.props.isRtl}
                                    menuBarMenuClassName={classNames(styles.menuBarMenu)}
                                    onClick={this.props.onClickAccount}
                                    onClose={this.props.onRequestCloseAccount}
                                    onLogOut={this.props.onLogOut}
                                />
                            </React.Fragment>
                        ) : (
                            // ********* user not logged in, but a session exists
                            // ********* so they can choose to log in
                            <React.Fragment>
                                <div
                                    className={classNames(
                                        styles.menuBarItem,
                                        styles.hoverable
                                    )}
                                    key="join"
                                    onMouseUp={this.props.onOpenRegistration}
                                >
                                    <FormattedMessage
                                        defaultMessage="Join Scratch"
                                        description="Link for creating a Scratch account"
                                        id="gui.menuBar.joinScratch"
                                    />
                                </div>
                                <div
                                    className={classNames(
                                        styles.menuBarItem,
                                        styles.hoverable
                                    )}
                                    key="login"
                                    onMouseUp={this.props.onClickLogin}
                                >
                                    <FormattedMessage
                                        defaultMessage="Sign in"
                                        description="Link for signing in to your Scratch account"
                                        id="gui.menuBar.signIn"
                                    />
                                    <LoginDropdown
                                        className={classNames(styles.menuBarMenu)}
                                        isOpen={this.props.loginMenuOpen}
                                        isRtl={this.props.isRtl}
                                        renderLogin={this.props.renderLogin}
                                        onClose={this.props.onRequestCloseLogin}
                                    />
                                </div>
                            </React.Fragment>
                        )
                    ) : (
                        // ******** no login session is available, so don't show login stuff
                        <React.Fragment>
                            <div className={classNames(styles.menuBarItem, styles.feedbackButtonWrapper)}>
                                <a
                                    className={styles.feedbackLink}
                                    href="https://scratch.mit.edu/discuss/topic/312261/"
                                    rel="noopener noreferrer"
                                    target="_blank"
                                >
                                    <Button
                                        className={styles.feedbackButton}
                                        iconSrc={feedbackIcon}
                                    >
                                        <FormattedMessage
                                            defaultMessage="Give Feedback"
                                            description="Label for feedback form modal button"
                                            id="gui.menuBar.giveFeedback"
                                        />
                                    </Button>
                                </a>
                            </div>
                            <MenuBarItemTooltip id="mystuff">
                                <div
                                    className={classNames(
                                        styles.menuBarItem,
                                        styles.hoverable,
                                        styles.mystuffButton
                                    )}
                                >
                                    <img
                                        className={styles.mystuffIcon}
                                        src={mystuffIcon}
                                    />
                                </div>
                            </MenuBarItemTooltip>
                            <MenuBarItemTooltip
                                id="account-nav"
                                place={this.props.isRtl ? 'right' : 'left'}
                            >
                                <div
                                    className={classNames(
                                        styles.menuBarItem,
                                        styles.hoverable,
                                        styles.accountNavMenu
                                    )}
                                >
                                    <img
                                        className={styles.profileIcon}
                                        src={profileIcon}
                                    />
                                    <span>
                                        {'scratch-cat'}
                                    </span>
                                    <img
                                        className={styles.dropdownCaretIcon}
                                        src={dropdownCaret}
                                    />
                                </div>
                            </MenuBarItemTooltip>
                        </React.Fragment>
                    )}
                </div>
            </Box>
        );
    }
}

MenuBar.propTypes = {
    accountMenuOpen: PropTypes.bool,
    canUpdateProject: PropTypes.bool,
    editMenuOpen: PropTypes.bool,
    enableCommunity: PropTypes.bool,
    fileMenuOpen: PropTypes.bool,
    intl: intlShape,
    isRtl: PropTypes.bool,
    languageMenuOpen: PropTypes.bool,
    loginMenuOpen: PropTypes.bool,
    onClickAccount: PropTypes.func,
    onClickEdit: PropTypes.func,
    onClickFile: PropTypes.func,
    onClickLanguage: PropTypes.func,
    onClickLogin: PropTypes.func,
    onLogOut: PropTypes.func,
    onOpenRegistration: PropTypes.func,
    onOpenTipLibrary: PropTypes.func,
    onRequestCloseAccount: PropTypes.func,
    onRequestCloseEdit: PropTypes.func,
    onRequestCloseFile: PropTypes.func,
    onRequestCloseLanguage: PropTypes.func,
    onRequestCloseLogin: PropTypes.func,
    onRequestNewProject: PropTypes.func,
    onSeeCommunity: PropTypes.func,
    onToggleLoginOpen: PropTypes.func,
    onUpdateProjectTitle: PropTypes.func,
    renderLogin: PropTypes.func,
    sessionExists: PropTypes.bool,
    userOwnsProject: PropTypes.bool,
    username: PropTypes.string
};

const mapStateToProps = state => ({
    canUpdateProject: typeof (state.session && state.session.session && state.session.session.user) !== 'undefined',
    accountMenuOpen: accountMenuOpen(state),
    fileMenuOpen: fileMenuOpen(state),
    editMenuOpen: editMenuOpen(state),
    isRtl: state.locales.isRtl,
    languageMenuOpen: languageMenuOpen(state),
    loginMenuOpen: loginMenuOpen(state),
    sessionExists: state.session && typeof state.session.session !== 'undefined',
    username: state.session && state.session.session && state.session.session.user ?
        state.session.session.user.username : null
});

const mapDispatchToProps = dispatch => ({
    onOpenTipLibrary: () => dispatch(openTipsLibrary()),
    onClickAccount: () => dispatch(openAccountMenu()),
    onRequestCloseAccount: () => dispatch(closeAccountMenu()),
    onClickFile: () => dispatch(openFileMenu()),
    onRequestCloseFile: () => dispatch(closeFileMenu()),
    onClickEdit: () => dispatch(openEditMenu()),
    onRequestCloseEdit: () => dispatch(closeEditMenu()),
    onClickLanguage: () => dispatch(openLanguageMenu()),
    onRequestCloseLanguage: () => dispatch(closeLanguageMenu()),
    onClickLogin: () => dispatch(openLoginMenu()),
    onRequestCloseLogin: () => dispatch(closeLoginMenu()),
    onSeeCommunity: () => dispatch(setPlayer(true))
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(MenuBar));
