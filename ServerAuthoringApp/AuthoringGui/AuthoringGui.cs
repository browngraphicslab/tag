using System;
using System.IO;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using Microsoft.Win32;
using ServerAuthoringApp;

namespace AuthoringGui
{

    public partial class AuthoringGui : Form
    {
        private WorkTopDbInterface _importer;

        public AuthoringGui()
        {
            InitializeComponent();
            _importer = new WorkTopDbInterface();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            Microsoft.Win32.OpenFileDialog dialog = new Microsoft.Win32.OpenFileDialog();
            dialog.Title = "Select Image Files to Import";
            dialog.InitialDirectory = @"c:\";
            dialog.Filter = "Image Files(*.BMP;*.JPG;*.GIF)|*.BMP;*.JPG;*.GIF|All files (*.*)|*.*";
            dialog.FilterIndex = 2;
            dialog.RestoreDirectory = true;
            dialog.Multiselect = true;
            dialog.CheckFileExists = true;
            dialog.CheckPathExists = true;

            Nullable<bool> result = dialog.ShowDialog();
            if (result == true)
            {
                _importer.ImportArtworks(dialog.FileNames);
            }
        }

        private void label1_Click(object sender, EventArgs e)
        {

        }


    }
}
